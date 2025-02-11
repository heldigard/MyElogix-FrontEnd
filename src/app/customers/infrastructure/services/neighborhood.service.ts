import { inject, Injectable } from '@angular/core';
import { GenericNamedService } from '../../../generics/insfrastructure/services/generic-named.service';
import { Neighborhood } from '../../domain/models/Neighborhood';
import { NeighborhoodGateway } from '../../domain/models/gateways/NeighborhoodGateway';
import { NeighborhoodUseCase } from '../../domain/usecase/NeighborhoodUseCase';

@Injectable({
  providedIn: 'root',
})
export class NeighborhoodService extends GenericNamedService<
  Neighborhood,
  NeighborhoodGateway,
  NeighborhoodUseCase
> {
  constructor() {
    super(inject(NeighborhoodUseCase));
  }
}
