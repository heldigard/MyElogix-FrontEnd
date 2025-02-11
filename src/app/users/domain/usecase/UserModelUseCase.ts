import { Injectable } from '@angular/core';
import { GenericUseCase } from '../../../generics/domain/usecase/GenericUseCase';
import { UserModelGateway } from '../models/gateways/UserModelGateway';
import { UserModel } from '../models/UserModel';

@Injectable({
  providedIn: 'root',
})
export class UserModelUseCase extends GenericUseCase<
  UserModel,
  UserModelGateway
> {
  constructor(protected override gateway: UserModelGateway) {
    super(gateway);
  }
}
