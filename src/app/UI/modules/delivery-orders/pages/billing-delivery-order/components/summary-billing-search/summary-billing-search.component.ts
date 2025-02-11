import {
  Component,
  inject,
  Input,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import {
  cellStyleStatusProduction,
  comparatorDateFilter,
  dateFormatterDay,
  getEndDayWithTimezone,
  statusFormatter,
} from '@shared';
import { AgGridAngular, AgGridModule } from 'ag-grid-angular';
import {
  ColDef,
  FirstDataRenderedEvent,
  GridApi,
  GridReadyEvent,
  RowModelType,
} from 'ag-grid-community';
import {
  from,
  interval,
  Subject,
  Subscription,
  switchMap,
  takeUntil,
} from 'rxjs';
import { DeliveryOrderBasic } from '../../../../../../../delivery_order/domain/model/DeliveryOrderBasic';
import { DeliveryOrderBasicService } from '../../../../../../../delivery_order/infrastructure/delivery-order-basic/delivery-order-basic.service';
import { DateRange } from '../../../../../../../shared/domain/models/pagination/DateRange';
import { PaginationCriteria } from '../../../../../../../shared/domain/models/pagination/PaginationCriteria';
import { BooleanRendererComponent } from '../../../../../../shared/components/boolean-renderer/boolean-renderer.component';
import {
  getStartDayStartLastDays,
  getStartDayWithTimezone,
} from '../../../../../../shared/utils-date';
import { BillingDeliveryOrderService } from '../../billing-delivery-order.service';

@Component({
  selector: 'app-summary-billing-search',
  templateUrl: './summary-billing-search.component.html',
  styleUrls: ['./summary-billing-search.component.scss'],
  imports: [MatButtonModule, MatTooltipModule, MatIconModule, AgGridModule],
})
export class SummaryBillingSearchComponent implements OnInit, OnDestroy {
  private gridApi!: GridApi<DeliveryOrderBasic>;
  public columnDefs: ColDef[];
  public defaultColDef: ColDef;
  public overlayLoadingTemplate: string;
  public overlayNoRowsTemplate: string;
  public rowData: DeliveryOrderBasic[] = [];
  private readonly rowModelType: RowModelType = 'clientSide';
  public gridOptions: any;
  private isLoaded = false;
  protected pageSize: number = 50;
  @Input() currentModule: string = '';
  @Input() title: string = '';
  @Input() screenType!: string;
  @Input() advancedSearch!: boolean;
  private readonly timerSubject = new Subject<void>();
  private subscriptions: Subscription[] = [];
  private readonly REFRESH_INTERVAL = 300000; // 5 minutes in milliseconds
  private readonly orderService: DeliveryOrderBasicService = inject(
    DeliveryOrderBasicService,
  );
  private billingDeliveryOrderService: BillingDeliveryOrderService = inject(
    BillingDeliveryOrderService,
  );

  @ViewChild(AgGridAngular) grid?: AgGridAngular<DeliveryOrderBasic>;

  constructor() {
    this.columnDefs = [];
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
      '<span style="padding: 10px; border: 2px solid #444; background: lightgoldenrodyellow;">No se encontro ninguna orden</span>';
    this.gridOptions = {
      rowModelType: this.rowModelType,
      rowSelection: {
        mode: 'multiRow',
        checkboxes: true,
        enableClickSelection: true,
        enableSelectionWithoutKeys: true,
        hideDisabledCheckboxes: true,
      },
      rowBuffer: 0,
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
    this.rowData = [];
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

  initSubscriptions(): void {
    // Reload subscription
    this.subscriptions.push(
      this.orderService.reloadOrders.subscribe(() => {
        void this.getDeliveryOrders();
      }),
    );

    // Timer subscription with from to convert Promise to Observable
    this.subscriptions.push(
      interval(this.REFRESH_INTERVAL)
        .pipe(
          takeUntil(this.timerSubject),
          switchMap(() => from(this.getDeliveryOrders())),
        )
        .subscribe(),
    );
  }

  onGridReady(params: GridReadyEvent<DeliveryOrderBasic>) {
    if (params.api) {
      this.gridApi = params.api;
      this.setLoading(true);
      void this.getDeliveryOrders().then(() => {
        this.setLoading(false);
      });
    }
  }

  private setLoading(loading: boolean): void {
    if (this.gridApi && !this.gridApi.isDestroyed()) {
      this.gridApi.setGridOption('loading', loading);
    }
  }

  getColumnsDefs(): any {
    return [
      {
        headerName: '# Orden',
        field: 'id',
        minWidth: 100,
        maxWidth: 100,
        type: 'numericColumn',
        filter: false,
        floatingFilter: false,
        resizable: false,
      },
      {
        headerName: 'Cliente',
        field: 'customer.name',
        minWidth: 240,
        maxWidth: 240,
      },
      {
        headerName: 'Ruta',
        field: 'deliveryZone.name',
        minWidth: 120,
        maxWidth: 120,
      },
      {
        headerName: 'Dia',
        field: 'createdAt',
        filter: 'agDateColumnFilter',
        filterParams: {
          comparator: comparatorDateFilter,
        },
        valueFormatter: dateFormatterDay,
        minWidth: 145,
        maxWidth: 145,
      },
      {
        headerName: 'Estado',
        field: 'status.name',
        maxWidth: 110,
        filter: false,
        cellStyle: cellStyleStatusProduction,
        valueFormatter: statusFormatter,
      },
      {
        headerName: 'Impreso',
        field: 'isBilled',
        minWidth: 90,
        maxWidth: 90,
        filter: false,
        cellRenderer: BooleanRendererComponent,
      },
    ];
  }

  public async getDeliveryOrders(): Promise<void> {
    try {
      // Set loading state
      if (this.gridApi) {
        this.gridApi.setGridOption('loading', true);
        this.gridApi.setGridOption('columnDefs', this.getColumnsDefs());
      }

      const pagination: PaginationCriteria = this.getPagination();

      const dateRange: DateRange = {
        startDate:
          this.currentModule === 'lastDays'
            ? getStartDayStartLastDays(7)
            : getStartDayWithTimezone(),
        endDate: getEndDayWithTimezone(),
      };

      const orders = await this.orderService.getOrdersForInvoicing(
        pagination,
        dateRange,
      );

      this.fillRowData(orders);
    } catch (error) {
      console.error('Error fetching delivery orders:', error);
      // Consider showing an error message to the user
    } finally {
      // Always reset loading state
      if (this.gridApi) {
        this.gridApi.setGridOption('loading', false);
      }
    }
  }

  protected getPagination(): PaginationCriteria {
    return {
      page: 0,
      pageSize: 100,
      sortOrders: [
        {
          direction: 'DESC',
          property: 'createdAt',
        },
        {
          direction: 'ASC',
          property: 'id',
        },
      ],
    };
  }

  fillRowData(data: DeliveryOrderBasic[]) {
    if (this.gridApi) {
      this.rowData = data;
      if (this.gridApi && !this.gridApi.isDestroyed())
        this.gridApi.setGridOption('loading', false);
    }
  }

  onFirstDataRendered(params: FirstDataRenderedEvent) {
    params.api.sizeColumnsToFit();
  }

  onSelectionChanged(event: any) {
    const selectedData: DeliveryOrderBasic[] = this.gridApi.getSelectedRows();
    this.billingDeliveryOrderService.setState({
      selectedOrders: selectedData,
    });
  }
}
