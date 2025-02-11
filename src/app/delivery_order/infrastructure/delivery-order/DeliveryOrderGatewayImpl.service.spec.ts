import { TestBed } from '@angular/core/testing';

import { DeliveryOrderGatewayImpl } from './DeliveryOrderGatewayImpl.service';

describe('DeliveryOrderGatewayImpl', () => {
  let service: DeliveryOrderGatewayImpl;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DeliveryOrderGatewayImpl);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
