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
import { comparatorDateFilter, dateFormatterDay } from '@shared';
import { AgGridAngular, AgGridModule } from 'ag-grid-angular';
import {
  ColDef,
  FirstDataRenderedEvent,
  GridApi,
  GridReadyEvent,
  RowModelType,
  ValueGetterParams,
} from 'ag-grid-community';
import {
  from,
  interval,
  Subject,
  Subscription,
  switchMap,
  takeUntil,
} from 'rxjs';
import { CustomerOrdersSummaryDTO } from '../../../../../../../delivery_order/dto/CustomerOrdersSummaryDTO';
import { DeliveryOrderBasicService } from '../../../../../../../delivery_order/infrastructure/delivery-order-basic/delivery-order-basic.service';
import { DeliveryOrderService } from '../../../../../../../delivery_order/infrastructure/delivery-order/delivery-order.service';
import { DateRange } from '../../../../../../../shared/domain/models/pagination/DateRange';
import { PaginationCriteria } from '../../../../../../../shared/domain/models/pagination/PaginationCriteria';
import { BooleanRendererComponent } from '../../../../../../shared/components/boolean-renderer/boolean-renderer.component';
import {
  getEndDayWithTimezone,
  getStartDayStartLastDays,
  getStartDayWithTimezone,
} from '../../../../../../shared/utils-date';
import { BillOrderRendererComponent } from '../bill-order-renderer/bill-order-renderer.component';
import { OrderIdRendererComponent } from '../order-id-renderer/order-id-renderer.component';

@Component({
  selector: 'app-billing-search',
  templateUrl: './billing-search.component.html',
  styleUrls: ['./billing-search.component.scss'],
  imports: [MatButtonModule, MatTooltipModule, MatIconModule, AgGridModule],
})
export class BillingDeliveryOrdersSearchComponent implements OnInit, OnDestroy {
  private gridApi!: GridApi<CustomerOrdersSummaryDTO>;
  public columnDefs: ColDef[];
  public defaultColDef: ColDef;
  public overlayLoadingTemplate: string;
  public overlayNoRowsTemplate: string;
  public rowData: CustomerOrdersSummaryDTO[] = [];
  private readonly rowModelType: RowModelType = 'clientSide';
  public gridOptions: any;
  private isLoaded = false;
  protected pageSize: number = 50;
  @Input() currentModule: string = '';
  @Input() title: string = '';
  @Input() isBilled: boolean = false;
  @Input() screenType!: string;
  private readonly timerSubject = new Subject<void>();
  private subscriptions: Subscription[] = [];
  private readonly REFRESH_INTERVAL = 300000; // 5 minutos en ms
  private readonly orderService: DeliveryOrderService =
    inject(DeliveryOrderService);
  private readonly orderBasicService: DeliveryOrderBasicService = inject(
    DeliveryOrderBasicService,
  );

  @ViewChild(AgGridAngular) grid?: AgGridAngular<CustomerOrdersSummaryDTO>;

  constructor() {
    this.columnDefs = this.getColumnsDefs();
    this.defaultColDef = {
      flex: 1,
      // minWidth: 150,
      sortable: true,
      filter: true,
      floatingFilter: true,
      editable: false,
      resizable: true,
    };

    this.overlayLoadingTemplate =
      '<span class="ag-overlay-loading-center">Favor espere mientras consulta las ordenes</span>';
    this.overlayNoRowsTemplate =
      '<span style="padding: 10px; border: 2px solid #444; background: lightgoldenrodyellow;">No se encontro ningun cliente</span>';

    this.gridOptions = {
      rowModelType: this.rowModelType,
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
      components: {
        orderIdRenderer: OrderIdRendererComponent,
      },
    };
  }

  ngOnInit(): void {
    this.isLoaded = false;
    this.rowData = [];
    this.pageSize = 50;
    this.initSubscriptions();
    this.initTitle();
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

  initSubscriptions() {
    this.subscriptions = [];
    this.subscriptions.push(
      this.orderBasicService.reloadOrders.subscribe(() => {
        void this.loadBilledOrdersByCustomer();
      }),
    );
    this.subscriptions.push(
      interval(this.REFRESH_INTERVAL)
        .pipe(
          takeUntil(this.timerSubject),
          switchMap(() => from(this.loadBilledOrdersByCustomer())),
        )
        .subscribe(),
    );
  }

  initTitle() {
    if (this.isBilled) {
      this.title = this.title + ' Impresas';
    } else {
      this.title = this.title + ' Sin Imprimir';
    }
  }

  getColumnsDefs(): any {
    return [
      // { field: 'id', maxWidth: 100, type: 'numericColumn' },
      {
        headerName: '',
        maxWidth: 35,
        filter: false,
        floatingFilter: false,
        resizable: false,
        cellRenderer: BillOrderRendererComponent,
        valueGetter: getValueButtonRendered,
      },
      {
        headerName: 'Cliente',
        field: 'customerName',
        minWidth: 250,
        maxWidth: 280,
      },
      {
        headerName: 'Ruta',
        field: 'deliveryZoneName',
        minWidth: 120,
        maxWidth: 120,
      },
      {
        headerName: 'Dia',
        field: 'day',
        filter: 'agDateColumnFilter',
        // add extra parameters for the date filter
        filterParams: {
          // provide comparator function
          comparator: comparatorDateFilter,
        },
        // filter: false,
        valueFormatter: dateFormatterDay,
        maxWidth: 120,
      },
      {
        headerName: '# Ord',
        field: 'deliveryOrdersCount',
        minWidth: 75,
        maxWidth: 80,
      },
      {
        headerName: 'Ordenes',
        field: 'deliveryOrderIds',
        minWidth: 150,
        maxWidth: 200,
        cellRenderer: OrderIdRendererComponent,
        cellRendererParams: {
          maxVisible: 3,
        },
        filter: 'agTextColumnFilter',
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

  onGridReady(params: GridReadyEvent<CustomerOrdersSummaryDTO>) {
    if (params.api) {
      this.gridApi = params.api;
      this.setLoading(true);
      void this.loadBilledOrdersByCustomer().then(() => {
        this.setLoading(false);
      });
    }
  }

  private setLoading(loading: boolean): void {
    if (this.gridApi && !this.gridApi.isDestroyed()) {
      this.gridApi.setGridOption('loading', loading);
    }
  }

  public loadBilledOrdersByCustomer(): Promise<CustomerOrdersSummaryDTO[]> {
    if (this.gridApi) {
      this.gridApi.setGridOption('loading', true);
    }
    this.gridApi.setGridOption('columnDefs', this.getColumnsDefs());

    const createdAtStart: string =
      this.currentModule == 'lastDays'
        ? getStartDayStartLastDays(7)
        : getStartDayWithTimezone();
    const createdAtEnd: string = getEndDayWithTimezone();
    const dateRange: DateRange = {
      startDate: createdAtStart,
      endDate: createdAtEnd,
    };
    // Get pagination with default size of 100
    const pagination: PaginationCriteria = this.orderBasicService.getPagination(
      undefined,
      100,
    );

    // Call service with correct parameters
    return this.orderBasicService
      .findCustomerOrdersSummary(this.isBilled, pagination, dateRange, {
        includeDeleted: false,
      })
      .then((data: CustomerOrdersSummaryDTO[]) => {
        this.fillRowData(data);
        return data;
      })
      .catch((err) => {
        console.error('Error fetching customer orders summary:', err);
        this.gridApi?.setGridOption('loading', false);
        return [];
      });
  }

  fillRowData(data: CustomerOrdersSummaryDTO[]) {
    this.rowData = data;
    this.gridApi.setGridOption('loading', false);
  }

  onFirstDataRendered(params: FirstDataRenderedEvent) {
    params.api.sizeColumnsToFit();
  }
}

function getValueButtonRendered(
  params: ValueGetterParams,
): CustomerOrdersSummaryDTO {
  return {
    customerId: params.data['customerId'],
    deliveryOrdersCount: 0,
    day: params.data['day'],
    customerName: params.data['customerName'],
    deliveryZoneName: params.data['deliveryZoneName'],
    deliveryOrderIds: params.data['deliveryOrderIds'],
    isBilled: params.data['isBilled'],
  };
}
