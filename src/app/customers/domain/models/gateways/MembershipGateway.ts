import { Observable } from 'rxjs';
import { GenericGateway } from '../../../../generics/domain/gateway/GenericGateway';
import { ApiResponse } from '../../../../generics/dto/ApiResponse';
import { EMembership } from '../EMembership';
import { Membership } from '../Membership';

export abstract class MembershipGateway extends GenericGateway<Membership> {
  abstract deleteByName(
    name: string,
    options: { asPromise?: boolean; includeDeleted?: boolean },
  ): Observable<ApiResponse<Membership>> | Promise<ApiResponse<Membership>>;
  abstract findByName(
    name: EMembership,
    options?: { includeDeleted?: boolean; asPromise?: boolean },
  ): Observable<ApiResponse<Membership>> | Promise<ApiResponse<Membership>>;
}
