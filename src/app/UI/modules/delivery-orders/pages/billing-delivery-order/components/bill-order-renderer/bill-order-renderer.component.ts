import { NgClass, NgIf, NgOptimizedImage } from '@angular/common';
import { Component } from '@angular/core';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';
import { EStatus } from '../../../../../../../delivery-orders/domain/models/EStatus';
import { CustomerOrdersSummaryDTO } from '../../../../../../../delivery_order/dto/CustomerOrdersSummaryDTO';
import { DeliveryOrdersGroupByCustomersAndStatusAndBilledResponse } from '../../../../../../../delivery_order/dto/DeliveryOrdersGroupByCustomersAndStatusAndBilledResponse';
import { BillingDeliveryOrderService } from '../../billing-delivery-order.service';

@Component({
  selector: 'app-bill-order-renderer',
  templateUrl: './bill-order-renderer.component.html',
  styleUrls: ['./bill-order-renderer.component.scss'],
  imports: [MatTooltipModule, NgIf, NgOptimizedImage, NgClass],
})
export class BillOrderRendererComponent implements ICellRendererAngularComp {
  public params!: ICellRendererParams;
  public imgForValue: string;
  public iconClass: string;
  public customerOrdersSummary: CustomerOrdersSummaryDTO;

  protected readonly EStatus = EStatus;

  constructor(
    private billingDeliveryOrderService: BillingDeliveryOrderService,
  ) {
    this.customerOrdersSummary = {
      customerId: -1,
      deliveryOrdersCount: -1,
      day: '',
      customerName: '',
      deliveryZoneName: '',
      deliveryOrderIds: [],
      isBilled: false,
    };
    this.imgForValue = '';
    this.iconClass = '';
  }

  // gets called once before the renderer is used
  agInit(params: ICellRendererParams): void {
    this.params = params;
    this.customerOrdersSummary = params.data;
    this.setIcon(params.data);
  }

  // gets called whenever the user gets the cell to refresh
  refresh(params: ICellRendererParams) {
    // set value into cell again
    this.params = params;
    this.customerOrdersSummary = params.data;
    this.setIcon(params.data);
    return true;
  }

  buttonClicked() {
    this.sendCustomerToBill();
  }

  private setIcon(
    data: DeliveryOrdersGroupByCustomersAndStatusAndBilledResponse,
  ) {
    switch (data.isBilled) {
      case false:
        this.imgForValue = 'assets/icons/bill-delivery-order-icon.png';
        this.iconClass = 'img-billing';
        break;
      case true:
        this.imgForValue = 'assets/icons/view-icon.png';
        this.iconClass = 'img-view';
        break;
    }
  }

  sendCustomerToBill() {
    this.billingDeliveryOrderService.processDeliveryOrders(
      this.customerOrdersSummary,
    );
  }
}
