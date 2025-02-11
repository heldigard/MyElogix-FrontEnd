import { Component, inject, Input, OnDestroy, OnInit } from '@angular/core';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatTooltip } from '@angular/material/tooltip';
import { AgGridAngular } from 'ag-grid-angular';
import {
  CellValueChangedEvent,
  ColDef,
  GridApi,
  GridReadyEvent,
  RowModelType,
} from 'ag-grid-community';
import { ToastrService } from 'ngx-toastr';
import { City } from '../../../../../../../customers/domain/models/City';
import { CityService } from '../../../../../../../customers/infrastructure/services/city.service';
import { NeighborhoodListCellRendererComponent } from './components/neighborhood-list-cell-renderer/neighborhood-list-cell-renderer.component';

@Component({
  selector: 'app-city-edit',
  imports: [AgGridAngular, MatIcon, MatIconButton, MatTooltip],
  templateUrl: './city-edit.component.html',
  styleUrl: './city-edit.component.scss',
})
export class CityEditComponent implements OnInit, OnDestroy {
  public rowData!: City[];
  private gridApi!: GridApi<City>;
  public columnDefs: ColDef[];
  public defaultColDef: ColDef;

  public overlayLoadingTemplate!: string;
  public overlayNoRowsTemplate!: string;
  private readonly rowModelType: RowModelType;
  public gridOptions: any;
  @Input() title!: string;

  private readonly cityService: CityService = inject(CityService);
  private readonly toastrService: ToastrService = inject(ToastrService);

  constructor() {
    this.title = 'Ciudades';
    this.columnDefs = [];
    this.rowData = [];
    this.rowModelType = 'clientSide';
    this.defaultColDef = {
      flex: 1,
      sortable: true,
      filter: true,
      floatingFilter: true,
      editable: false,
      resizable: true,
    };

    this.overlayLoadingTemplate =
      '<span class="ag-overlay-loading-center">Favor espere mientras consulta los clientes</span>';
    this.overlayNoRowsTemplate =
      '<span style="padding: 10px; border: 2px solid #444; background: lightgoldenrodyellow;">No hay resultados para mostrar</span>';

    this.gridOptions = {
      rowBuffer: 0,
      maxBlocksInCache: 3,
      rowModelType: this.rowModelType,
      pagination: true,
      paginationAutoPageSize: true,
      animateRows: true,
      groupHeaderHeight: 75,
      headerHeight: 26,
      floatingFiltersHeight: 26,
      pivotGroupHeaderHeight: 50,
      pivotHeaderHeight: 100,
      overlayLoadingTemplate: this.overlayLoadingTemplate,
      overlayNoRowsTemplate: this.overlayNoRowsTemplate,
      suppressScrollOnNewData: true,
    };
  }

  ngOnInit() {
    if (this.rowData.length == 0) {
      this.refresh();
    }
  }

  ngOnDestroy() {}

  onGridReady(params: GridReadyEvent<City>) {
    this.gridApi = params.api;
    this.gridApi.setGridOption('columnDefs', this.getColumnsDefs());
  }

  getColumnsDefs(): any {
    return [
      {
        headerName: 'ID',
        field: 'id',
        minWidth: 60,
        maxWidth: 60,
        type: 'numericColumn',
        filter: false,
      },
      {
        headerName: 'Nombre',
        minWidth: 120,
        field: 'name',
        editable: true,
      },
      {
        headerName: '# Barrios',
        field: 'neighborhoodList.length',
        filter: false,
        minWidth: 120,
        maxWidth: 120,
      },
      {
        headerName: 'Barrios',
        field: 'neighborhoodList',
        minWidth: 120,
        cellRenderer: NeighborhoodListCellRendererComponent,
      },
    ];
  }

  refresh() {
    // Actualizar para usar el nuevo método getDataList() que retorna el array del signal
    this.rowData = this.cityService.items();
    this.cityService
      .fetchAllData()
      .then(() => {
        if (this.gridApi && !this.gridApi.isDestroyed()) {
          this.gridApi.setGridOption('loading', false);
        }
      })
      .catch((error) => {
        console.error('Error fetching cities:', error);
        // Manejar el error apropiadamente
      });
  }

  onCellValueChanged($event: CellValueChangedEvent<any>) {
    const cityChanged: City = {
      id: $event.data.id,
      name: $event.data.name,
    } as City;
    this.cityService
      .update(cityChanged)
      .then((response: City) => {
        this.toastrService.success(response.name, 'Guardada', {
          closeButton: true,
          progressBar: true,
          timeOut: 1500,
        });
        this.refresh();
      })
      .catch((error) => {
        this.toastrService.error(
          `${cityChanged.name} ${error}`,
          'NO Guardada',
          {
            closeButton: true,
            progressBar: true,
            timeOut: 1500,
          },
        );
      });
  }
}
