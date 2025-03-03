import { NgClass, NgIf } from '@angular/common';
import {
  Component,
  computed,
  effect,
  inject,
  Input,
  type OnInit,
} from '@angular/core';
import { SCREEN_TYPE_VIEW_BILL } from '@globals';
import { type Status } from '../../../../../delivery-orders/domain/models/Status';
import { DeliveryOrderService } from '../../../../../delivery_order/infrastructure/delivery-order/delivery-order.service';

@Component({
  selector: 'app-order-header',
  templateUrl: './order-header.component.html',
  styleUrls: ['./order-header.component.scss'],
  imports: [NgClass, NgIf],
})
export class OrderHeaderComponent implements OnInit {
  @Input() public screenType!: string;
  @Input() public orderId: number = -1;
  @Input() public orderStatus: Status = { id: -1 };

  public headerClass = 'container-fluid';
  protected readonly order = computed(() =>
    this.orderService.getCurrentOrder(),
  );

  private readonly orderService: DeliveryOrderService =
    inject(DeliveryOrderService);

  constructor() {
    effect(() => {
      const order = this.order();
      if (order) {
        this.orderId = order.id ?? -1;
        this.orderStatus = order.status || { description: 'N/A' };
      }
    });
  }

  ngOnInit() {
    this.setHeaderClass();
  }

  setHeaderClass() {
    this.headerClass =
      this.screenType !== SCREEN_TYPE_VIEW_BILL
        ? 'container-fluid floating'
        : 'container-fluid';
  }
}
