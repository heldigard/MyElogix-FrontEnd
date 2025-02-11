import { TestBed } from '@angular/core/testing';

import { BillingDeliveryOrderService } from './billing-delivery-order.service';

describe('BillingDeliveryOrderService', () => {
  let service: BillingDeliveryOrderService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BillingDeliveryOrderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
