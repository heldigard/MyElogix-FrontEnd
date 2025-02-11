import { inject, Injectable } from '@angular/core';
import { GenericNamedService } from '../../../generics/insfrastructure/services/generic-named.service';
import { MetricUnit } from '../../domain/models/MetricUnit';
import { MetricUnitGateway } from '../../domain/models/gateways/MetricUnitGateway';
import { MetricUnitUseCase } from '../../domain/usecase/MetricUnitUseCase';

@Injectable({
  providedIn: 'root',
})
export class MetricUnitService extends GenericNamedService<
  MetricUnit,
  MetricUnitGateway,
  MetricUnitUseCase
> {
  constructor() {
    super(inject(MetricUnitUseCase));
  }
}
