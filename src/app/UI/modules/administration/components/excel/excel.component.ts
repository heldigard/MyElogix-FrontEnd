import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { HttpEventType, HttpResponse } from '@angular/common/http';
import { MatIcon } from '@angular/material/icon';
import {
  MatCard,
  MatCardActions,
  MatCardContent,
  MatCardTitle,
} from '@angular/material/card';
import { MatFormField } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import {
  FormControl,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatDivider } from '@angular/material/divider';
import { NgIf, NgStyle } from '@angular/common';
import { MatButton, MatIconButton } from '@angular/material/button';
import { IExcelService } from '../../../../../shared/domain/models/auth/IExcelService';
import { ResponseMessageDTO } from '../../../../../shared/domain/models/ResponseMessageDTO';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { lastValueFrom } from 'rxjs';

@Component({
  selector: 'app-excel',
  imports: [
    MatIcon,
    MatCard,
    MatCardContent,
    MatCardTitle,
    MatFormField,
    MatInputModule,
    ReactiveFormsModule,
    MatDivider,
    MatCardActions,
    NgStyle,
    NgIf,
    FormsModule,
    MatButton,
    MatIconButton,
    MatProgressSpinner,
  ],
  templateUrl: './excel.component.html',
  styleUrl: './excel.component.scss',
})
export class ExcelComponent implements OnInit {
  public responseMessage!: ResponseMessageDTO;
  public fileToUpload!: any;
  public progress = 0;
  public displayFileName!: FormControl;
  @Input() excelService!: IExcelService;
  @Input() fileName: string = 'db-excel';
  private readonly ALLOWED_EXTENSIONS = ['.xlsx', '.xls'];
  private readonly MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
  public isLoading = false;
  public loadingMessage = '';

  constructor() {
    this.ngOnInit();
  }

  ngOnInit(): void {
    this.resetForm();
  }

  // Modificar el método resetResponseMessage para incluir el reset del formulario
  resetForm() {
    this.responseMessage = {
      message: '',
      success: false,
    };
    this.progress = 0;
    this.fileToUpload = null;
    // Crear un nuevo FormControl sin validador required
    this.displayFileName = new FormControl({ value: '', disabled: true });
  }

  downloadExcelFile() {
    this.responseMessage = {
      message: 'Descargando archivo...',
      success: true,
    };

    const downloadPromise = this.excelService.downloadExcelFile();
    (downloadPromise instanceof Promise
      ? downloadPromise
      : lastValueFrom(downloadPromise)
    )
      .then((response: HttpResponse<Blob>) => {
        const contentDisposition = response.headers.get('content-disposition');
        const contentType = response.headers.get('content-type');

        if (!response.body) {
          throw new Error('El archivo está vacío');
        }

        const filename = this.getFilenameFromResponse(contentDisposition);
        const blob = new Blob([response.body], {
          type: contentType ?? 'application/vnd.ms-excel',
        });
        this.downloadFile(blob, filename);

        this.responseMessage = {
          message: 'Archivo descargado exitosamente',
          success: true,
        };
      })
      .catch((error) => {
        this.responseMessage = {
          message: `Error al descargar el archivo: ${error.message || 'Error desconocido'}`,
          success: false,
        };
        console.error('Error downloading file:', error);
      });
  }

  private getFilenameFromResponse(contentDisposition: string | null): string {
    if (contentDisposition) {
      const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
      const matches = filenameRegex.exec(contentDisposition);
      if (matches?.[1]) {
        return matches[1].replace(/['"]/g, '');
      }
    }
    return `${this.fileName}.xlsx`;
  }

  private downloadFile(blob: Blob, filename: string): void {
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  }

  onFileChange(files: FileList | null) {
    if (files?.length) {
      const file = files.item(0);
      if (file) {
        // Validar extensión
        const extension = file.name
          .toLowerCase()
          .slice(file.name.lastIndexOf('.'));
        if (!this.ALLOWED_EXTENSIONS.includes(extension)) {
          this.responseMessage = {
            message: `Tipo de archivo no permitido. Use: ${this.ALLOWED_EXTENSIONS.join(', ')}`,
            success: false,
          };
          return;
        }

        // Validar tamaño
        if (file.size > this.MAX_FILE_SIZE) {
          this.responseMessage = {
            message: 'El archivo excede el tamaño máximo permitido (5MB)',
            success: false,
          };
          return;
        }

        this.fileToUpload = file;
        this.displayFileName?.setValue(this.fileToUpload.name);
        // Limpiar solo el mensaje de respuesta
        this.responseMessage = {
          message: '',
          success: false,
        };
      }
    }
  }

  uploadExcelFile() {
    console.log('Iniciando carga de archivo...');
    this.setLoading(true, 'Subiendo archivo...');

    if (!this.fileToUpload) {
      console.log('No hay archivo seleccionado');
      this.responseMessage = {
        message: 'Por favor seleccione un archivo',
        success: false,
      };
      this.setLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append('file', this.fileToUpload);

    const uploadPromise = this.excelService.uploadExcelFile(formData);
    (uploadPromise instanceof Promise
      ? uploadPromise
      : lastValueFrom(uploadPromise)
    )
      .then((response: any) => {
        console.log('Respuesta del servidor:', response);
        this.responseMessage = {
          message: response.message || 'Archivo cargado exitosamente',
          success: response.success,
        };
        this.fileToUpload = null;
        this.displayFileName.setValue('');
        this.progress = 100;
      })
      .catch((error) => {
        console.error('Error detallado:', error);
        this.progress = 0;
        this.responseMessage = {
          message: `Error al cargar el archivo: ${error.message || 'Error desconocido'}`,
          success: false,
        };
      })
      .finally(() => {
        this.setLoading(false);
      });
  }

  private setLoading(loading: boolean, message: string = '') {
    this.isLoading = loading;
    this.loadingMessage = message;
  }
}
