import { Component, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ActivatedRoute, Router } from '@angular/router';
import { URL_ADMIN, URL_ADMIN_CLIENTS, URL_ADMIN_CLIENTS_EDIT } from '@globals';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';
import { CustomerBasic } from '../../../../../../../customers/domain/models/CustomerBasic';
import { CustomerService } from '../../../../../../../customers/infrastructure/services/customer.service';

@Component({
  selector: 'app-create-order-renderer',
  templateUrl: './edit-customer-renderer.component.html',
  styleUrls: ['./edit-customer-renderer.component.scss'],
  imports: [MatTooltipModule, MatIconModule],
})
export class EditCustomerRendererComponent implements ICellRendererAngularComp {
  public customerBasic!: CustomerBasic;

  private readonly customerService: CustomerService = inject(CustomerService);
  private readonly router: Router = inject(Router);
  private readonly route: ActivatedRoute = inject(ActivatedRoute);

  constructor() {
    this.customerBasic = this.customerService.getBlank();
  }

  // gets called once before the renderer is used
  agInit(params: ICellRendererParams): void {
    this.customerBasic = params.data;
  }

  // gets called whenever the user gets the cell to refresh
  refresh(params: ICellRendererParams) {
    // set value into cell again
    this.customerBasic = params.data;
    return true;
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
