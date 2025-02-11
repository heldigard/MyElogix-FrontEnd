import { MeasureDetail } from '../../../delivery-orders/domain/models/MeasureDetail';
import { MetricUnit } from '../../../delivery-orders/domain/models/MetricUnit';
import { ProductBasic } from '../../../delivery-orders/domain/models/ProductBasic';
import { GenericProduction } from '../../../generics/domain/model/GenericProduction';

export interface ProductOrder extends GenericProduction {
  // Required property
  product: ProductBasic; // Reference to the base product details

  // Optional properties (marked with ?)
  amount?: number; // Quantity ordered
  measure1?: number; // First measurement value
  measure2?: number; // Second measurement value
  metricUnit?: MetricUnit; // Unit of measurement
  measureDetail?: MeasureDetail; // Additional measurement details
  observation?: string; // Notes or comments
  deliveryOrderId?: number; // Reference to parent delivery order
}
