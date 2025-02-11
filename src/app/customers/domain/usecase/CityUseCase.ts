import { Injectable } from '@angular/core';
import { GenericNamedUseCase } from '../../../generics/domain/usecase/GenericNamedUseCase';
import { City } from '../models/City';
import { CityGateway } from '../models/gateways/CityGateway';

@Injectable({
  providedIn: 'root',
})
export class CityUseCase extends GenericNamedUseCase<City, CityGateway> {
  constructor(protected override gateway: CityGateway) {
    super(gateway);
  }
}
