import { TestBed } from '@angular/core/testing';

import { DeliveryZoneGatewayImpl } from './DeliveryZoneGatewayImpl.service';

describe('DeliveryZoneGatewayImpl', () => {
  let service: DeliveryZoneGatewayImpl;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DeliveryZoneGatewayImpl);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
