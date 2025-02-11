import { TestBed } from '@angular/core/testing';

import { CustomerBasicGatewayImpl } from './CustomerBasicGatewayImpl.service';

describe('CustomerBasicGatewayImplServiceService', () => {
  let service: CustomerBasicGatewayImpl;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CustomerBasicGatewayImpl);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
