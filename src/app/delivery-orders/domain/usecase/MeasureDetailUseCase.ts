import { Injectable } from '@angular/core';
import { GenericNamedUseCase } from '../../../generics/domain/usecase/GenericNamedUseCase';
import { MeasureDetail } from '../models/MeasureDetail';
import { MeasureDetailGateway } from '../models/gateways/MeasureDetailGateway';

@Injectable({
  providedIn: 'root',
})
export class MeasureDetailUseCase extends GenericNamedUseCase<
  MeasureDetail,
  MeasureDetailGateway
> {
  constructor(protected override gateway: MeasureDetailGateway) {
    super(gateway);
  }
}
