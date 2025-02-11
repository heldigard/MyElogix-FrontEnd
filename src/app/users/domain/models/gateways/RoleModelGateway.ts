import { Observable } from 'rxjs';
import { GenericGateway } from '../../../../generics/domain/gateway/GenericGateway';
import { ERole } from '../ERole';
import { RoleModel } from '../RoleModel';

export abstract class RoleModelGateway extends GenericGateway<RoleModel> {
  abstract deleteByName(name: ERole): Observable<boolean>;
  abstract findByName(name: ERole): Observable<RoleModel>;
}
