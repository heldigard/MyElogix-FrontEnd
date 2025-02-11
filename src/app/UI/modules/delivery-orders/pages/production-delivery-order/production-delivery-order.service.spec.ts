import { TestBed } from '@angular/core/testing';

import { ProductionDeliveryOrderService } from './production-delivery-order.service';

describe('ProductionDeliveryOrderService', () => {
  let service: ProductionDeliveryOrderService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProductionDeliveryOrderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
