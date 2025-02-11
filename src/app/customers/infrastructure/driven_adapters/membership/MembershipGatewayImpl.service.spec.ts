import { TestBed } from '@angular/core/testing';

import { MembershipGatewayImpl } from './MembershipGatewayImpl.service';

describe('MembershipGatewayImpl', () => {
  let service: MembershipGatewayImpl;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MembershipGatewayImpl);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
