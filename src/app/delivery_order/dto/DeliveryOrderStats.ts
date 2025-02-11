export interface DeliveryOrderStats {
  pendingCount: number;
  productionCount: number;
  finishedCount: number;
  deliveredCount: number;
  cancelledCount: number;
  pausedCount: number;
}
