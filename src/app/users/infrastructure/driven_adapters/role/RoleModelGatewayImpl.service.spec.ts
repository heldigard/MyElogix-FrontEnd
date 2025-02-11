import { TestBed } from '@angular/core/testing';

import { RoleModelGatewayImpl } from './RoleModelGatewayImpl.service';

describe('RoleModelGatewayImpl', () => {
  let service: RoleModelGatewayImpl;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RoleModelGatewayImpl);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
