import { TestBed } from '@angular/core/testing';

import { DeliveryOrderBasicGatewayImpl } from './DeliveryOrderBasicGatewayImpl.service';

describe('DeliveryOrderBasicGatewayImpl', () => {
  let service: DeliveryOrderBasicGatewayImpl;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DeliveryOrderBasicGatewayImpl);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
