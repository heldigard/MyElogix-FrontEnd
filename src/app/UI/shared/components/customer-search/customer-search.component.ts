import { Component, effect, inject, Input, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MODULE_COMMERCIAL, MODULE_CUSTOMER_ADMIN } from '@globals';
import { AgGridModule } from 'ag-grid-angular';
import { GridApi } from 'ag-grid-community';
import { CustomerBasic } from '../../../../customers/domain/models/CustomerBasic';
import { CustomerBasicService } from '../../../../customers/infrastructure/services/customer-basic.service';
import { DeliveryOrderService } from '../../../../delivery_order/infrastructure/delivery-order/delivery-order.service';
import { ClickEditCustomerRendererComponent } from '../../../modules/administration/pages/customer-administration/components/click-edit-customer-renderer/click-edit-customer-renderer.component';
import { EditCustomerRendererComponent } from '../../../modules/administration/pages/customer-administration/components/edit-customer-renderer/edit-customer-renderer.component';
import { ClickCreateOrderRendererComponent } from '../../../modules/delivery-orders/pages/commercial-delivery-order/components/click-create-order-renderer/click-create-order-renderer.component';
import { CreateOrderRendererComponent } from '../../../modules/delivery-orders/pages/commercial-delivery-order/components/create-order-renderer/create-order-renderer.component';
import { MembershipRendererComponent } from '../../../modules/delivery-orders/pages/commercial-delivery-order/components/membership-renderer/membership-renderer.component';
import { SearchFormComponent } from '../search-form/search-form.component';
import { GridBaseComponent } from '../gridbase/gridbase.component';

@Component({
  selector: 'app-customers-search',
  templateUrl: './customer-search.component.html',
  styleUrls: ['./customer-search.component.scss'],
  imports: [
    MatButtonModule,
    MatTooltipModule,
    MatIconModule,
    AgGridModule,
    SearchFormComponent,
  ],
})
export class CustomerSearchComponent extends GridBaseComponent {
  protected gridApi!: GridApi<CustomerBasic>;
  get rowData(): CustomerBasic[] {
    return this.customerService.items();
  }
  private readonly orderService: DeliveryOrderService =
    inject(DeliveryOrderService);
  private readonly customerService = inject(CustomerBasicService);

  @Input() title!: string;
  @Input() currentModule!: string;

  constructor() {
    super();

    this.overlayLoadingTemplate =
      '<span class="ag-overlay-loading-center">Favor espere mientras consulta los clientes</span>';

    effect(() => {
      this.refresh();
    });
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
      this.gridApi?.setGridOption('loading', true);
      // Esto disparará el effect cuando se actualice el signal

      if (this.rowData.length === 0 || force) {
        this.customerService.fetchAllData({
          sortOrders: this.customerService.createSortOrders(),
        });
      }

      this.gridApi?.setGridOption('loading', false);
    }
  }

  createNewOrderFromCustomer(id: number) {
    this.orderService.createNewOrderFromCustomer(id);
  }

  public addCustomer(name: string) {
    if (!name.trim()) {
      return;
    }

    // First try exact reference match
    let customer: CustomerBasic | undefined =
      this.customerService.findInListByName(name);

    // If no exact match found, get first product from current grid list
    if (!customer && this.gridApi) {
      const gridRows = this.gridApi.getDisplayedRowCount();
      if (gridRows > 0) {
        const firstRow = this.gridApi.getDisplayedRowAtIndex(0);
        if (firstRow) {
          customer = firstRow.data;
        }
      }
    }

    // If we found a product either way, set it as current
    if (customer?.id !== undefined) {
      this.customerService.setCurrentItem(customer);
      this.createNewOrderFromCustomer(customer.id);
      this.resetFilters();
    }
  }
}
