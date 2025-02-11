import { Injectable } from '@angular/core';
import { GenericNamedGatewayImpl } from '../../../../generics/insfrastructure/GenericNamedGatewayImpl';
import { NeighborhoodGateway } from '../../../domain/models/gateways/NeighborhoodGateway';
import { Neighborhood } from '../../../domain/models/Neighborhood';

@Injectable({
  providedIn: 'root',
})
export class NeighborhoodGatewayImpl
  extends GenericNamedGatewayImpl<Neighborhood>
  implements NeighborhoodGateway
{
  constructor() {
    super('/neighborhood');
  }
}
