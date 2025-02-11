import { Injectable } from '@angular/core';
import { GenericNamedUseCase } from '../../../generics/domain/usecase/GenericNamedUseCase';
import { MetricUnit } from '../models/MetricUnit';
import { MetricUnitGateway } from '../models/gateways/MetricUnitGateway';

@Injectable({
  providedIn: 'root',
})
export class MetricUnitUseCase extends GenericNamedUseCase<
  MetricUnit,
  MetricUnitGateway
> {
  constructor(protected override gateway: MetricUnitGateway) {
    super(gateway);
  }
}
