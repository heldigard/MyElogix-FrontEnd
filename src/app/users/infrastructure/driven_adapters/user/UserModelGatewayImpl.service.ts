import { Injectable } from '@angular/core';
import { GenericNamedGatewayImpl } from '../../../../generics/insfrastructure/GenericNamedGatewayImpl';
import { UserModelGateway } from '../../../domain/models/gateways/UserModelGateway';
import { UserModel } from '../../../domain/models/UserModel';

@Injectable({
  providedIn: 'root',
})
export class UserModelGatewayImpl
  extends GenericNamedGatewayImpl<UserModel>
  implements UserModelGateway
{
  constructor() {
    super('/user');
  }
}
