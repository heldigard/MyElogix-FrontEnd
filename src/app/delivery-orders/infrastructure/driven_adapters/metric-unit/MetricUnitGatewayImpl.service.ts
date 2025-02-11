import { Injectable } from '@angular/core';
import { GenericNamedGatewayImpl } from '../../../../generics/insfrastructure/GenericNamedGatewayImpl';
import { MetricUnit } from '../../../domain/models/MetricUnit';
import { MetricUnitGateway } from '../../../domain/models/gateways/MetricUnitGateway';

@Injectable({
  providedIn: 'root',
})
export class MetricUnitGatewayImpl
  extends GenericNamedGatewayImpl<MetricUnit>
  implements MetricUnitGateway
{
  constructor() {
    super('/metric-unit');
  }
}
