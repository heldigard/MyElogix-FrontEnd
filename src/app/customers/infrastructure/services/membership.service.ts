import { inject, Injectable } from '@angular/core';
import { GenericService } from '../../../generics/insfrastructure/services/generic.service';
import { Membership } from '../../domain/models/Membership';
import { MembershipGateway } from '../../domain/models/gateways/MembershipGateway';
import { MembershipUseCase } from '../../domain/usecase/MembershipUseCase';

@Injectable({
  providedIn: 'root',
})
export class MembershipService extends GenericService<
  Membership,
  MembershipGateway,
  MembershipUseCase
> {
  constructor() {
    super(inject(MembershipUseCase));
  }
}
