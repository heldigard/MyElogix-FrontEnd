import { TestBed } from '@angular/core/testing';

import { UserModelGatewayImpl } from './UserModelGatewayImpl.service';

describe('UserModelGatewayImpl', () => {
  let service: UserModelGatewayImpl;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserModelGatewayImpl);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
