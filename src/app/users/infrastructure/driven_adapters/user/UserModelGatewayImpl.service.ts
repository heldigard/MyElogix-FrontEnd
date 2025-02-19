import { Injectable } from '@angular/core';
import { GenericNamedGatewayImpl } from '../../../../generics/insfrastructure/GenericNamedGatewayImpl';
import { UserModelGateway } from '../../../domain/models/gateways/UserModelGateway';
import { UserModel } from '../../../domain/models/UserModel';
import type { Observable } from 'rxjs';

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

  override uploadExcelFile(formData: FormData): Observable<any> | Promise<any> {
    return super.uploadExcelFile(formData, { asPromise: true }) as Promise<any>;
  }
}
