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
    ],
    templateUrl: './excel.component.html',
    styleUrl: './excel.component.scss'
})
export class ExcelComponent implements OnInit, OnDestroy {
  public responseMessage!: ResponseMessageDTO;
  public fileToUpload!: any;
  public progress = 0;
  public displayFileName!: FormControl;

  @Input() excelService!: IExcelService;

  constructor() {
    this.ngOnInit();
  }

  ngOnInit(): void {
    this.resetResponseMessage();
    this.displayFileName = new FormControl('', Validators.required);
  }

  ngOnDestroy() {}

  resetResponseMessage() {
    this.responseMessage = {
      message: '',
      success: false,
    };
    this.progress = 0;
  }

  downloadExcelFile() {
    this.excelService
      .downloadExcelFile()
      .then((response: HttpResponse<Blob>) => {
        console.log('response', response);
        const contentDisposition = response.headers.get('content-disposition');
        if (contentDisposition) {
          const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
          const filenameMatches = filenameRegex.exec(contentDisposition);
          const filename =
            filenameMatches != null && filenameMatches[1]
              ? filenameMatches[1].replace(/['"]/g, '')
              : 'customers.xlsx';

          const contentType = response.headers.get('content-type');
          const blob = response.body
            ? new Blob([response.body], {
                type: contentType ? contentType : undefined,
              })
            : null;
          if (blob) {
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', filename);
            document.body.appendChild(link);
            link.click();
          } else {
            console.log('Response body is null');
          }
        } else {
          // Handle the case when contentDisposition is null
          console.log('Content-Disposition header is missing');
        }
      });
  }

  onFileChange(files: FileList | null) {
    if (files?.length) {
      this.fileToUpload = files.item(0);
      this.displayFileName?.setValue(this.fileToUpload.name);
      this.resetResponseMessage();
    }
  }

  uploadExcelFile() {
    this.resetResponseMessage();

    if (!this.fileToUpload) {
      return;
    }

    this.excelService
      .uploadExcelFile(this.fileToUpload)
      .then((res: any) => {
        if (res.type === HttpEventType.UploadProgress) {
          // Do something when upload progress updates
          this.progress = Math.round((100 * res.loaded) / res.total);
          console.log(`File upload is ${this.progress}% complete.`);
        } else {
          this.responseMessage = res as ResponseMessageDTO;
          // Aquí puedes manejar la respuesta del backend, por ejemplo mostrar un mensaje de éxito al usuario
          this.fileToUpload = undefined;
          this.displayFileName?.setValue('');
        }
      })
      .catch((error) => {
        this.progress = 0;
        this.responseMessage.message = `Error uploading file: ${error}`;
        this.responseMessage.success = false;
        console.error(error);
        // Aquí puedes manejar el error en caso de que ocurra durante la carga del archivo
      });
  }
}
