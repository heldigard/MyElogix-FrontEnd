import { TestBed } from '@angular/core/testing';

import { DeliveryZoneBasicGatewayImpl } from './DeliveryZoneBasicGatewayImpl.service';

describe('DeliveryZoneBasicGatewayImplServiceService', () => {
  let service: DeliveryZoneBasicGatewayImpl;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DeliveryZoneBasicGatewayImpl);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
