import { Component, Input } from '@angular/core';
import type { DeliveryOrderResponse } from '../../../../../delivery_order/dto/DeliveryOrderResponse'
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-order-stats',
  imports: [NgIf],
  templateUrl: './order-stats.component.html',
  styleUrl: './order-stats.component.scss',
})
export class OrderStatsComponent {
  @Input() orderResponse!: DeliveryOrderResponse;
}
