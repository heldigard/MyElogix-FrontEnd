export interface CustomerOrdersSummaryDTO {
  customerId: number;
  deliveryOrdersCount: number;
  day: string;
  customerName: string;
  deliveryZoneName: string;
  isBilled: boolean;
  deliveryOrderIds: number[];
}
