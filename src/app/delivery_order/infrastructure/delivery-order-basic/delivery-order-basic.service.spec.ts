import { TestBed } from '@angular/core/testing';

import { DeliveryOrderBasicService } from './delivery-order-basic.service';

describe('DeliveryOrderBasicService', () => {
  let service: DeliveryOrderBasicService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DeliveryOrderBasicService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
