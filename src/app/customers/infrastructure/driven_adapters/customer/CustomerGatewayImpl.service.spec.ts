import { TestBed } from '@angular/core/testing';

import { CustomerGatewayImpl } from './CustomerGatewayImpl.service';

describe('CustomerGatewayImplServiceService', () => {
  let service: CustomerGatewayImpl;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CustomerGatewayImpl);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
