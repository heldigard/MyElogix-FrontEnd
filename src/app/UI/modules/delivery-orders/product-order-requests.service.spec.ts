import { TestBed } from '@angular/core/testing';

import { ProductOrderRequestsService } from './product-order-requests.service';

describe('ProductOrderRequestsService', () => {
  let service: ProductOrderRequestsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProductOrderRequestsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
