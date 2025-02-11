import { Injectable } from '@angular/core';
import { GenericNamedUseCase } from '../../../generics/domain/usecase/GenericNamedUseCase';
import { Neighborhood } from '../models/Neighborhood';
import { NeighborhoodGateway } from '../models/gateways/NeighborhoodGateway';

@Injectable({
  providedIn: 'root',
})
export class NeighborhoodUseCase extends GenericNamedUseCase<
  Neighborhood,
  NeighborhoodGateway
> {
  constructor(protected override gateway: NeighborhoodGateway) {
    super(gateway);
  }
}
