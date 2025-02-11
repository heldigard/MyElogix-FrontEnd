import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { URL_ADMIN, URL_ADMIN_CLIENTS, URL_ADMIN_CLIENTS_EDIT } from '@globals';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';
import { CustomerBasic } from '../../../../../../../customers/domain/models/CustomerBasic';
import { CustomerService } from '../../../../../../../customers/infrastructure/services/customer.service';

@Component({
  selector: 'app-click-create-order-renderer',
  templateUrl: './click-edit-customer-renderer.component.html',
  styleUrls: ['./click-edit-customer-renderer.component.scss'],
  standalone: true,
})
export class ClickEditCustomerRendererComponent
  implements ICellRendererAngularComp
{
  public customerBasic!: CustomerBasic;
  public cellValue: string | undefined;

  private readonly customerService: CustomerService = inject(CustomerService);
  private readonly router: Router = inject(Router);
  private readonly route: ActivatedRoute = inject(ActivatedRoute);

  constructor() {
    this.customerBasic = this.customerService.getBlank();
  }

  agInit(params: ICellRendererParams): void {
    this.customerBasic = params.data;
    this.cellValue = this.getValueToDisplay(params);
  }

  // gets called whenever the user gets the cell to refresh
  refresh(params: ICellRendererParams) {
    // set value into cell again
    this.customerBasic = params.data;
    return true;
  }

  getValueToDisplay(params: ICellRendererParams) {
    return params.valueFormatted ? params.valueFormatted : params.value;
  }

  buttonClicked() {
    this.sendIdEditCustomer();
  }

  sendIdEditCustomer() {
    this.customerService.setCurrentCustomerById(this.customerBasic.id!);
    this.router.navigate(
      [URL_ADMIN, URL_ADMIN_CLIENTS, URL_ADMIN_CLIENTS_EDIT],
      {
        relativeTo: this.route.root,
        queryParams: { customerId: this.customerBasic.id },
      },
    );
  }
}
