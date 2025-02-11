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
import { Neighborhood } from '../../../../../../../customers/domain/models/Neighborhood';
import { NeighborhoodService } from '../../../../../../../customers/infrastructure/services/neighborhood.service';
import { DeliveryZoneListCellRendererComponent } from './components/delivery-zone-list-cell-renderer/delivery-zone-list-cell-renderer.component';

@Component({
  selector: 'app-neighborhood-edit',
  imports: [AgGridAngular, MatIcon, MatIconButton, MatTooltip],
  templateUrl: './neighborhood-edit.component.html',
  styleUrl: './neighborhood-edit.component.scss',
})
export class NeighborhoodEditComponent implements OnInit, OnDestroy {
  private gridApi: GridApi<Neighborhood> | null = null;
  rowData: Neighborhood[] = [];
  public columnDefs: ColDef[];
  public defaultColDef: ColDef;

  public overlayLoadingTemplate!: string;
  public overlayNoRowsTemplate!: string;
  private readonly rowModelType: RowModelType;
  public gridOptions: any;
  @Input() title!: string;

  private readonly neighborService: NeighborhoodService =
    inject(NeighborhoodService);
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
      '<span class="ag-overlay-loading-center">Por Favor, espere mientras consulta los clientes</span>';
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

  async ngOnInit() {
    await this.refresh();
  }

  ngOnDestroy() {
    if (this.gridApi) {
      this.gridApi.destroy();
    }
  }

  onGridReady(params: GridReadyEvent<Neighborhood>) {
    this.gridApi = params.api;
    if (this.gridApi) {
      this.gridApi.setGridOption('columnDefs', this.getColumnsDefs());
    }
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
        headerName: 'Ciudad',
        field: 'city.name',
        filter: false,
        minWidth: 120,
      },
      {
        headerName: 'Ruta',
        field: 'deliveryZone',
        filter: false,
        minWidth: 120,
        editable: true,
        cellRenderer: DeliveryZoneListCellRendererComponent,
      },
    ];
  }

  async refresh() {
    try {
      if (this.gridApi) {
        this.gridApi.setGridOption('loading', true);
      }
      await this.neighborService.fetchAllData();
      this.rowData = this.neighborService.items();
      if (this.gridApi && !this.gridApi.isDestroyed()) {
        this.gridApi.setGridOption('loading', false);
      }
    } catch (error) {
      console.error('Error loading neighborhoods:', error);
      if (this.gridApi && !this.gridApi.isDestroyed()) {
        this.gridApi.setGridOption('loading', false);
      }
    }
  }

  onCellValueChanged($event: CellValueChangedEvent<any>) {
    const neighborhoodChanged: Neighborhood = {
      id: $event.data.id,
      name: $event.data.name,
      city: {
        id: $event.data.city.id,
      },
      deliveryZone: {
        id: $event.data.deliveryZone.id,
      },
    } as Neighborhood;

    this.neighborService
      .update(neighborhoodChanged)
      .then((response: Neighborhood) => {
        this.toastrService.success(response.name, 'Guardado', {
          closeButton: true,
          progressBar: true,
          timeOut: 1500,
        });
        this.refresh();
      })
      .catch((error) => {
        this.toastrService.error(
          `${neighborhoodChanged.name} ${error}`,
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
