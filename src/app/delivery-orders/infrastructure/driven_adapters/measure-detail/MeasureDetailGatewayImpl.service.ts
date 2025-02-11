import { Injectable } from '@angular/core';
import { GenericNamedGatewayImpl } from '../../../../generics/insfrastructure/GenericNamedGatewayImpl';
import { MeasureDetail } from '../../../domain/models/MeasureDetail';
import { MeasureDetailGateway } from '../../../domain/models/gateways/MeasureDetailGateway';

@Injectable({
  providedIn: 'root',
})
export class MeasureDetailGatewayImpl
  extends GenericNamedGatewayImpl<MeasureDetail>
  implements MeasureDetailGateway
{
  constructor() {
    super('/measure-detail');
  }
}
