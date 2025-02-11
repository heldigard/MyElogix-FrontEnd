export interface DeliveryOrdersGroupByCustomersAndStatusAndBilledResponse {
  customer_id: number;
  delivery_orders_count: number;
  day: string;
  customerName: string;
  statusName: string;
  deliveryZoneName: string;
  isBilled: boolean;
}
