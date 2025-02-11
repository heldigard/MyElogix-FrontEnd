import { NgIf } from '@angular/common';
import {
  Component,
  EventEmitter,
  inject,
  Input,
  OnDestroy,
  OnInit,
  Output,
  signal,
  ViewChild,
  type AfterViewInit,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatGridList, MatGridTile } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import {
  comparatorDateFilter,
  dateFormatterHour,
  statusFormatter,
} from '@shared';
import { AgGridAngular, AgGridModule } from 'ag-grid-angular';
import {
  ColDef,
  GridApi,
  GridReadyEvent,
  PaginationChangedEvent,
  RowModelType,
} from 'ag-grid-community';
import { from, interval, Subject, Subscription } from 'rxjs';
import { switchMap, takeUntil } from 'rxjs/operators';
import { EStatus } from '../../../../../delivery-orders/domain/models/EStatus';
import { DeliveryOrderBasic } from '../../../../../delivery_order/domain/model/DeliveryOrderBasic';
import { DeliveryOrderBasicService } from '../../../../../delivery_order/infrastructure/delivery-order-basic/delivery-order-basic.service';
import { BooleanRendererComponent } from '../../../../shared/components/boolean-renderer/boolean-renderer.component';
import { cellStyleStatusProduction } from '../../../../shared/utils';
import { ClickOrderRendererComponent } from '../click-order-renderer/click-order-renderer.component';
import { CustomTooltipByUserComponent } from '../custom-tooltip-by-user/custom-tooltip-by-user.component';
import { CustomTooltipCustomerComponent } from '../custom-tooltip-customer/custom-tooltip-customer.component';
import { EditOrderRendererComponent } from '../edit-order-renderer/edit-order-renderer.component';
import type { PaginationResponse } from '../../../../../generics/dto/PaginationResponse';

@Component({
  selector: 'app-delivery-orders-search',
  templateUrl: './delivery-orders-search.component.html',
  styleUrls: ['./delivery-orders-search.component.scss'],
  imports: [
    MatButtonModule,
    MatTooltipModule,
    MatIconModule,
    AgGridModule,
    FormsModule,
    NgIf,
    MatGridList,
    MatGridTile,
  ],
})
export class DeliveryOrdersSearchComponent
  implements OnInit, OnDestroy, AfterViewInit
{
  private gridApi!: GridApi<DeliveryOrderBasic>;
  public columnDefs: ColDef[];
  public defaultColDef: ColDef;
  public overlayLoadingTemplate: string;
  public overlayNoRowsTemplate: string;
  private readonly rowDataSignal = signal<DeliveryOrderBasic[]>([]);
  public readonly rowData = this.rowDataSignal.asReadonly();
  private readonly rowModelType: RowModelType = 'clientSide';
  public gridOptions: any;
  private isLoaded = false;
  protected currentPage: number = 0;
  protected pageSize: number = 50;

  @Input() statusToShow!: EStatus;
  @Input() currentModule!: string;
  @Input() title!: string;
  @Input() screenType!: string;
  @Output() onActiveDeliveryOrderView: EventEmitter<any> = new EventEmitter();
  @Input() advancedSearch!: boolean;
  public searchCustomer: string = '';
  public searchOrder: string = '';
  public searchDate: string = '';
  private readonly timerSubject = new Subject<void>();
  private subscriptions: Subscription[] = [];
  private readonly REFRESH_INTERVAL = 300000; // 5 minutos en ms
  private isLoadingMore = false;
  private readonly orderService: DeliveryOrderBasicService = inject(
    DeliveryOrderBasicService,
  );

  @ViewChild(AgGridAngular) grid?: AgGridAngular<DeliveryOrderBasic>;

  constructor() {
    this.columnDefs = this.getColumnsDefs();
    this.defaultColDef = {
      flex: 1,
      sortable: true,
      filter: true,
      floatingFilter: true,
      editable: false,
      resizable: true,
    };
    this.overlayLoadingTemplate =
      '<span class="ag-overlay-loading-center">Favor espere mientras consulta las ordenes</span>';
    this.overlayNoRowsTemplate =
      '<span style="padding: 10px; border: 2px solid #444; background: lightgoldenrodyellow;">No se encontraron ordenes</span>';
    this.gridOptions = {
      rowModelType: this.rowModelType,
      rowBuffer: 0,
      rowHeight: 50,
      maxBlocksInCache: 3,
      pagination: true,
      paginationAutoPageSize: true,
      animateRows: true,
      groupHeaderHeight: 75,
      headerHeight: 26,
      floatingFiltersHeight: 26,
      pivotGroupHeaderHeight: 50,
      pivotHeaderHeight: 100,
      tooltipShowDelay: 0,
      tooltipMouseTrack: 'true',
      overlayLoadingTemplate: this.overlayLoadingTemplate,
      overlayNoRowsTemplate: this.overlayNoRowsTemplate,
      suppressScrollOnNewData: true,
      context: { componentParent: this },
    };
  }

  ngOnInit(): void {
    this.isLoaded = false;
    this.pageSize = 50;
    this.initSubscriptions();
  }

  ngAfterViewInit() {
    if (this.grid?.api) {
      this.gridApi = this.grid.api;
    }
  }

  ngOnDestroy(): void {
    this.timerSubject.next();
    this.timerSubject.complete();
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }

  private initSubscriptions(): void {
    this.subscriptions.push(
      interval(this.REFRESH_INTERVAL)
        .pipe(
          takeUntil(this.timerSubject),
          switchMap(() =>
            from(
              this.orderService.getByStatus(
                this.statusToShow,
                this.pageSize,
                this.currentPage,
              ),
            ),
          ),
        )
        .subscribe((response: PaginationResponse<DeliveryOrderBasic>) => {
          // Comparar y actualizar solo las órdenes modificadas
          const currentOrders = this.rowData();
          const updatedOrders = response.rows.filter((newOrder) => {
            const currentOrder = currentOrders.find(
              (order) => order.id === newOrder.id,
            );
            return (
              !currentOrder || currentOrder.updatedAt !== newOrder.updatedAt
            );
          });

          if (updatedOrders.length > 0) {
            this.updateRows(updatedOrders);
          }
        }),
    );
  }

  onGridReady(params: GridReadyEvent<DeliveryOrderBasic>): void {
    if (params.api) {
      this.gridApi = params.api;
      this.setLoading(true);

      void this.getOrdersData({}).then(() => {
        this._hideColumns();
        this.setLoading(false);
      });
    }
  }

  private setLoading(loading: boolean): void {
    if (this.gridApi && !this.gridApi.isDestroyed()) {
      this.gridApi.setGridOption('loading', loading);
    }
  }

  private _hideColumns(): void {
    if (this.statusToShow) {
      this.gridApi.setColumnsVisible(['isBilled'], false);
      switch (this.statusToShow) {
        case EStatus.PENDING:
          this.setColumnsVisibility(
            [
              'productionAt',
              'finishedAt',
              'deliveredAt',
              'billedAt',
              'productionBy.username',
              'finishedBy.username',
              'deliveredBy.username',
              'billedBy.username',
            ],
            false,
          );
          break;
        case EStatus.PRODUCTION:
          this.setColumnsVisibility(
            [
              'createdAt',
              'finishedAt',
              'deliveredAt',
              'billedAt',
              'createdBy.username',
              'finishedBy.username',
              'deliveredBy.username',
              'billedBy.username',
            ],
            false,
          );
          break;
        case EStatus.FINISHED:
          this.setColumnsVisibility(
            [
              'createdAt',
              'productionAt',
              'deliveredAt',
              'billedAt',
              'createdBy.username',
              'productionBy.username',
              'deliveredBy.username',
              'billedBy.username',
            ],
            false,
          );
          break;
      }
    }
  }

  private setColumnsVisibility(columns: string[], visible: boolean): void {
    if (this.gridApi && !this.gridApi.isDestroyed()) {
      columns.forEach((column) =>
        this.gridApi.setColumnsVisible([column], visible),
      );
    }
  }

  private getColumnsDefs(): ColDef[] {
    return [
      {
        headerName: '',
        cellRenderer: EditOrderRendererComponent,
        cellRendererParams: {
          routerLink: this.screenType,
        },
        minWidth: 38,
        maxWidth: 38,
        filter: false,
        floatingFilter: false,
        resizable: false,
      },
      {
        headerName: '# Orden',
        cellRenderer: ClickOrderRendererComponent,
        cellRendererParams: {
          routerLink: this.screenType,
        },
        field: 'id',
        minWidth: 120,
        maxWidth: 120,
      },
      {
        headerName: 'Cliente',
        field: 'customer.name',
        minWidth: 200,
        maxWidth: 280,
        tooltipField: 'customer.name',
        tooltipComponent: CustomTooltipCustomerComponent,
        cellRenderer: ClickOrderRendererComponent,
        cellRendererParams: {
          routerLink: this.screenType,
        },
      },
      {
        headerName: 'Ruta',
        field: 'deliveryZone.name',
        minWidth: 120,
        cellRenderer: ClickOrderRendererComponent,
        cellRendererParams: {
          routerLink: this.screenType,
        },
      },
      {
        headerName: 'Estado',
        field: 'status.name',
        minWidth: 130,
        maxWidth: 130,
        cellStyle: cellStyleStatusProduction,
        valueFormatter: statusFormatter,
      },
      {
        headerName: 'Creado',
        field: 'createdAt',
        filter: 'agDateColumnFilter',
        filterParams: { comparator: comparatorDateFilter },
        valueFormatter: dateFormatterHour,
        minWidth: 174,
        maxWidth: 174,
      },
      {
        headerName: 'Impr',
        field: 'isBilled',
        maxWidth: 70,
        minWidth: 70,
        filter: false,
        cellRenderer: BooleanRendererComponent,
      },
      {
        headerName: 'Creador',
        field: 'createdBy.username',
        maxWidth: 160,
        minWidth: 160,
        tooltipField: 'createdBy',
        tooltipComponent: CustomTooltipByUserComponent,
      },
      {
        headerName: 'Produccion',
        field: 'productionAt',
        filter: 'agDateColumnFilter',
        filterParams: { comparator: comparatorDateFilter },
        valueFormatter: dateFormatterHour,
        minWidth: 174,
        maxWidth: 174,
      },
      {
        headerName: 'Productor',
        field: 'productionBy.username',
        maxWidth: 160,
        minWidth: 160,
        tooltipField: 'productionBy',
        tooltipComponent: CustomTooltipByUserComponent,
      },
      {
        headerName: 'Finalizado',
        field: 'finishedAt',
        filter: 'agDateColumnFilter',
        filterParams: { comparator: comparatorDateFilter },
        valueFormatter: dateFormatterHour,
        maxWidth: 174,
        minWidth: 174,
      },
      {
        headerName: 'Finalizador',
        field: 'finishedBy.username',
        maxWidth: 160,
        minWidth: 160,
        tooltipField: 'finishedBy',
        tooltipComponent: CustomTooltipByUserComponent,
      },
      {
        headerName: 'Despachado',
        field: 'deliveredAt',
        filter: 'agDateColumnFilter',
        filterParams: { comparator: comparatorDateFilter },
        valueFormatter: dateFormatterHour,
        maxWidth: 174,
        minWidth: 174,
      },
      {
        headerName: 'Despachador',
        field: 'deliveredBy.username',
        maxWidth: 160,
        minWidth: 160,
        tooltipField: 'deliveredBy',
        tooltipComponent: CustomTooltipByUserComponent,
      },
      {
        headerName: 'Cancelado',
        field: 'cancelledAt',
        filter: 'agDateColumnFilter',
        filterParams: { comparator: comparatorDateFilter },
        valueFormatter: dateFormatterHour,
        maxWidth: 174,
        minWidth: 174,
      },
      {
        headerName: 'Cancelador',
        field: 'cancelledBy.username',
        maxWidth: 160,
        minWidth: 160,
        tooltipField: 'cancelledBy',
        tooltipComponent: CustomTooltipByUserComponent,
      },
      {
        headerName: 'Impreso',
        field: 'billedAt',
        filter: 'agDateColumnFilter',
        filterParams: { comparator: comparatorDateFilter },
        valueFormatter: dateFormatterHour,
        maxWidth: 174,
        minWidth: 174,
      },
      {
        headerName: 'Impresor',
        field: 'billedBy.username',
        maxWidth: 160,
        minWidth: 160,
        tooltipField: 'billedBy',
        tooltipComponent: CustomTooltipByUserComponent,
      },
      {
        headerName: 'Actualizado',
        field: 'updatedAt',
        filter: 'agDateColumnFilter',
        filterParams: { comparator: comparatorDateFilter },
        valueFormatter: dateFormatterHour,
        maxWidth: 174,
        minWidth: 174,
      },
      {
        headerName: 'Actualizador',
        field: 'updatedBy.username',
        maxWidth: 160,
        minWidth: 160,
        tooltipField: 'updatedBy',
        tooltipComponent: CustomTooltipByUserComponent,
      },
    ];
  }

  protected getOrdersData(filters: any): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      if (this.isLoadingMore) {
        resolve();
        return;
      }

      this.isLoadingMore = true;
      try {
        this.setLoading(true);

        if (!this.isLoaded && this.gridApi && !this.gridApi.isDestroyed()) {
          this.isLoaded = true;
          this.gridApi.setGridOption('columnDefs', this.getColumnsDefs());
        }

        this.orderService
          .getByStatus(this.statusToShow, this.pageSize, this.currentPage)
          .then((data: PaginationResponse<DeliveryOrderBasic>) => {
            this.fillRowData(data);
            resolve();
          })
          .catch((err) => {
            console.error('Error fetching delivery orders:', err);
            if (this.gridApi && !this.gridApi.isDestroyed()) {
              this.gridApi.showNoRowsOverlay();
            }
            reject(err instanceof Error ? err : new Error(String(err)));
          })
          .finally(() => {
            this.setLoading(false);
            this.isLoadingMore = false;
          });
      } catch (error) {
        console.error('Error loading delivery orders:', error);
        this.gridApi?.showNoRowsOverlay();
        this.setLoading(false);
        reject(error instanceof Error ? error : new Error(String(error)));
      }
    });
  }

  private hasMoreData: boolean = true;

  private fillRowData(data: PaginationResponse<DeliveryOrderBasic>): void {
    // Si no hay nuevos datos, marcar que no hay más datos disponibles
    if (!data.rows.length) {
      this.hasMoreData = false;
      return;
    }

    // Verificar duplicados antes de actualizar
    this.rowDataSignal.update((currentRows) => {
      // Filtrar duplicados usando Set y los IDs
      const existingIds = new Set(currentRows.map((row) => row.id));
      const newRows = data.rows.filter((row) => !existingIds.has(row.id));

      return [...currentRows, ...newRows];
    });

    if (this.gridApi && !this.gridApi.isDestroyed()) {
      // Actualizar el grid con todos los datos
      this.gridApi.setGridOption('rowData', this.rowData());

      // Asegurarse que el grid mantenga la página actual
      const currentPage = this.gridApi.paginationGetCurrentPage();
      if (currentPage > 0) {
        this.gridApi.paginationGoToPage(currentPage);
      }
    }
  }

  onOrderUpdates(updatedOrders: DeliveryOrderBasic[]): void {
    this.updateRows(updatedOrders);
  }

  private updateRows(updatedRows: DeliveryOrderBasic[]): void {
    this.rowDataSignal.update((currentRows) => {
      // Crear un nuevo array con las filas actualizadas
      return currentRows.map((currentRow) => {
        const updatedRow = updatedRows.find((row) => row.id === currentRow.id);
        return updatedRow || currentRow;
      });
    });

    // Refrescar solo las filas modificadas en el grid
    if (this.gridApi && !this.gridApi.isDestroyed()) {
      const rowsToUpdate = this.gridApi
        .getRenderedNodes()
        .filter((node) => updatedRows.some((row) => row.id === node.data?.id));

      this.gridApi.refreshCells({
        rowNodes: rowsToUpdate,
        force: true,
      });
    }
  }

  onPaginationChange(event: PaginationChangedEvent): void {
    if (this.gridApi && !this.gridApi.isDestroyed()) {
      const currentPage = event.api.paginationGetCurrentPage();
      const totalPages = event.api.paginationGetTotalPages();

      // Solo cargar más datos si estamos en la última página y hay más datos disponibles
      if (currentPage + 1 === totalPages && this.hasMoreData) {
        this.currentPage++;
        this.setLoading(true);

        void this.getOrdersData({})
          .then(() => {
            // No necesitamos setGridOption aquí ya que fillRowData ya maneja la actualización
            this.setLoading(false);
          })
          .catch((error) => {
            console.error('Error loading more data:', error);
            this.setLoading(false);
          });
      }
    }
  }

  onFirstDataRendered(params: GridReadyEvent<DeliveryOrderBasic>): void {
    params.api.sizeColumnsToFit();
  }

  increasePageSize() {
    this.pageSize += 100;
    this.getOrdersData({});
  }

  handleActiveDeliveryOrderView($event: any): void {
    this.onActiveDeliveryOrderView.emit($event);
  }
}
