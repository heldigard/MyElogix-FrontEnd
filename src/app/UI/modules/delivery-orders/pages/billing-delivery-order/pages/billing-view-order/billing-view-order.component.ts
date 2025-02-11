import { NgFor, NgIf } from '@angular/common';
import {
  Component,
  ElementRef,
  inject,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MatDividerModule } from '@angular/material/divider';
import { SCREEN_TYPE_VIEW_BILL, SCREEN_TYPE_VIEW_PRODUCTION } from '@globals';
import { getDateAsString, getUserByAsString } from '@shared';
import { Subscription } from 'rxjs';
import { DeliveryZoneBasic } from '../../../../../../../customers/domain/models/DeliveryZoneBasic';
import { DeliveryOrder } from '../../../../../../../delivery_order/domain/model/DeliveryOrder';
import { DeliveryOrderResponse } from '../../../../../../../delivery_order/dto/DeliveryOrderResponse';
import { DeliveryOrderBasicService } from '../../../../../../../delivery_order/infrastructure/delivery-order-basic/delivery-order-basic.service';
import { DeliveryOrderService } from '../../../../../../../delivery_order/infrastructure/delivery-order/delivery-order.service';
import { BillingDeliveryOrderState } from '../../../../../../../delivery_order/infrastructure/state/billing-delivery-order-state';
import { UtcToLocalTimePipe } from '../../../../../../shared/pipes/utc-to-local-time.pipe';
import { OrderCustomerInfoComponent } from '../../../../components/order-customer-info/order-customer-info.component';
import { OrderHeaderComponent } from '../../../../components/order-header/order-header.component';
import { OrderStatsComponent } from '../../../../components/order-stats/order-stats.component';
import { PrintBillOrderComponent } from '../../../../components/print-bill-order/print-bill-order.component';
import { BillingDeliveryOrderService } from '../../billing-delivery-order.service';

@Component({
  selector: 'app-billing-view-order',
  templateUrl: './billing-view-order.component.html',
  styleUrls: ['./billing-view-order.component.scss'],
  imports: [
    NgIf,
    PrintBillOrderComponent,
    MatDividerModule,
    OrderCustomerInfoComponent,
    NgFor,
    OrderHeaderComponent,
    UtcToLocalTimePipe,
    OrderStatsComponent,
  ],
})
export class BillingViewOrderComponent implements OnInit, OnDestroy {
  public orderResponseList: DeliveryOrderResponse[] = [];
  private subscriptions: Subscription[] = [];

  public currentDeliveryZoneBasic: DeliveryZoneBasic;

  @ViewChild('printableArea') printableArea!: ElementRef;

  private billingDeliveryOrderService: BillingDeliveryOrderService = inject(
    BillingDeliveryOrderService,
  );
  public readonly orderService: DeliveryOrderService =
    inject(DeliveryOrderService);
  public readonly orderBasicService: DeliveryOrderBasicService = inject(
    DeliveryOrderBasicService,
  );

  protected readonly SCREEN_TYPE_VIEW_PRODUCTION = SCREEN_TYPE_VIEW_PRODUCTION;
  protected readonly SCREEN_TYPE_VIEW_BILL = SCREEN_TYPE_VIEW_BILL;
  getDateAsString = getDateAsString;
  getUserByAsString = getUserByAsString;

  constructor() {
    this.currentDeliveryZoneBasic = { id: -1 };
  }

  ngOnInit() {
    this.initSubscriptions();
  }

  ngOnDestroy() {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }

  initSubscriptions() {
    this.subscriptions.push(
      this.billingDeliveryOrderService.getState().subscribe({
        next: (state: BillingDeliveryOrderState) => {
          this.orderResponseList = state.orderList;
          if (
            state.orderList.length > 0 &&
            state.orderList[0].order?.deliveryZone
          ) {
            this.currentDeliveryZoneBasic =
              state.orderList[0].order.deliveryZone;
          }
        },
        error: (err) => {
          console.error('Error in billing view order subscription:', err);
        },
      }),
    );
  }

  onPrint() {
    const ids: number[] = this.orderResponseList.map(
      (order: DeliveryOrderResponse) => order.order.id!,
    );

    this.orderService
      .updateBatchBillingStatus(ids, true)
      .then(() => {
        this.orderBasicService.reloadOrders.next(true);
      })
      .catch((err) => console.error(err));
  }

  get deliveryOrdersForPrint(): DeliveryOrder[] {
    return this.orderResponseList
      .map((order) => order.order)
      .filter((order): order is DeliveryOrder => order !== undefined);
  }
}
