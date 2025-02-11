import type { MeasureDetail } from '../../../../../../../delivery-orders/domain/models/MeasureDetail';
import type { MetricUnit } from '../../../../../../../delivery-orders/domain/models/MetricUnit';

export interface ProductOrderFieldsChange {
  index: number;
  changes: {
    measure1?: number;
    measure2?: number;
    metricUnit?: MetricUnit;
    measureDetail?: MeasureDetail;
    observation?: string;
  };
}
