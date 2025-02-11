import { inject, Injectable } from '@angular/core';
import { GenericNamedService } from '../../../generics/insfrastructure/services/generic-named.service';
import { MeasureDetail } from '../../domain/models/MeasureDetail';
import { MeasureDetailGateway } from '../../domain/models/gateways/MeasureDetailGateway';
import { MeasureDetailUseCase } from '../../domain/usecase/MeasureDetailUseCase';

@Injectable({
  providedIn: 'root',
})
export class MeasureDetailService extends GenericNamedService<
  MeasureDetail,
  MeasureDetailGateway,
  MeasureDetailUseCase
> {
  constructor() {
    super(inject(MeasureDetailUseCase));
  }
}
