import { Component, effect, inject, Input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MODULE_COMMERCIAL, MODULE_CUSTOMER_ADMIN } from '@globals';
import { AgGridModule } from 'ag-grid-angular';
import {
  ColDef,
  GridApi,
  GridReadyEvent,
  RowModelType,
} from 'ag-grid-community';
import { CustomerBasic } from '../../../../customers/domain/models/CustomerBasic';
import { CustomerBasicService } from '../../../../customers/infrastructure/services/customer-basic.service';
import { DeliveryOrderService } from '../../../../delivery_order/infrastructure/delivery-order/delivery-order.service';
import { ClickEditCustomerRendererComponent } from '../../../modules/administration/pages/customer-administration/components/click-edit-customer-renderer/click-edit-customer-renderer.component';
import { EditCustomerRendererComponent } from '../../../modules/administration/pages/customer-administration/components/edit-customer-renderer/edit-customer-renderer.component';
import { ClickCreateOrderRendererComponent } from '../../../modules/delivery-orders/pages/commercial-delivery-order/components/click-create-order-renderer/click-create-order-renderer.component';
import { CreateOrderRendererComponent } from '../../../modules/delivery-orders/pages/commercial-delivery-order/components/create-order-renderer/create-order-renderer.component';
import { MembershipRendererComponent } from '../../../modules/delivery-orders/pages/commercial-delivery-order/components/membership-renderer/membership-renderer.component';

@Component({
  selector: 'app-customers-search',
  templateUrl: './customer-search.component.html',
  styleUrls: ['./customer-search.component.scss'],
  imports: [MatButtonModule, MatTooltipModule, MatIconModule, AgGridModule],
})
export class CustomerSearchComponent {
  private gridApi!: GridApi<CustomerBasic>;
  public columnDefs!: ColDef[];
  public defaultColDef: ColDef;

  public overlayLoadingTemplate!: string;
  public overlayNoRowsTemplate!: string;
  private readonly rowModelType: RowModelType;
  public gridOptions: any;

  get rowData(): CustomerBasic[] {
    return this.customerService.items();
  }
  private readonly orderService: DeliveryOrderService =
    inject(DeliveryOrderService);

  private readonly customerService = inject(CustomerBasicService);

  @Input() title!: string;
  @Input() currentModule!: string;

  constructor() {
    this.columnDefs = this.getColumnsDefs();
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
      context: { componentParent: this },
    };

    effect(() => {
      this.refresh();
    });
  }

  onGridReady(params: GridReadyEvent<CustomerBasic>) {
    this.gridApi = params.api;
    this.gridApi.setGridOption('columnDefs', this.getColumnsDefs());
    this.refresh();
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
        cellRenderer: this.getClickRendererComponent(),
      },
      {
        headerName: '',
        maxWidth: 35,
        filter: false,
        floatingFilter: false,
        resizable: false,
        cellRenderer: this.getCellRendererComponent(),
      },
      {
        headerName: 'Nombre',
        minWidth: 120,
        field: 'name',
        cellRenderer: this.getClickRendererComponent(),
      },
      {
        headerName: 'M',
        minWidth: 65,
        maxWidth: 65,
        field: 'membership',
        filter: false,
        cellRenderer: MembershipRendererComponent,
      },
      {
        headerName: 'NIT/CC',
        field: 'documentNumber',
        minWidth: 120,
        maxWidth: 160,
        cellRenderer: this.getClickRendererComponent(),
      },
      {
        headerName: 'Teléfono',
        field: 'phone',
        minWidth: 120,
        maxWidth: 160,
      },
      {
        headerName: 'Hits',
        field: 'hits',
        filter: false,
        minWidth: 90,
        maxWidth: 90,
      },
      { field: 'email', minWidth: 120, maxWidth: 250 },
    ];
  }

  getClickRendererComponent() {
    if (this.currentModule === MODULE_COMMERCIAL) {
      return ClickCreateOrderRendererComponent;
    } else if (this.currentModule === MODULE_CUSTOMER_ADMIN) {
      return ClickEditCustomerRendererComponent;
    }
    return undefined;
  }

  getCellRendererComponent() {
    if (this.currentModule === MODULE_COMMERCIAL) {
      return CreateOrderRendererComponent;
    } else if (this.currentModule === MODULE_CUSTOMER_ADMIN) {
      return EditCustomerRendererComponent;
    }
    return undefined;
  }

  refresh(force: boolean = false) {
    if (this.gridApi && !this.gridApi.isDestroyed()) {
      this.gridApi.setGridOption('loading', true);
      // Esto disparará el effect cuando se actualice el signal

      if (this.rowData.length === 0 || force) {
        this.customerService.fetchAllData({
          sortOrders: this.customerService.createSortOrders(),
        });
      }

      this.gridApi.setGridOption('loading', false);
    }
  }

  createNewOrderFromCustomer(id: number) {
    this.orderService.createNewOrderFromCustomer(id);
  }
}
