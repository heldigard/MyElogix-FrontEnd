import { inject, Injectable } from '@angular/core';
import { GenericNamedService } from '../../../generics/insfrastructure/services/generic-named.service';
import { CityUseCase } from '../../domain/usecase/CityUseCase';
import type { City } from '../../domain/models/City';
import type { CityGateway } from '../../domain/models/gateways/CityGateway';

@Injectable({
  providedIn: 'root',
})
export class CityService extends GenericNamedService<
  City,
  CityGateway,
  CityUseCase
> {
  constructor() {
    super(inject(CityUseCase));
  }
}
