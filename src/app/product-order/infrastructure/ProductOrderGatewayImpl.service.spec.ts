import { TestBed } from '@angular/core/testing';

import { ProductOrderGatewayImpl } from './ProductOrderGatewayImpl.service';

describe('ProductOrderGatewayImpl', () => {
  let service: ProductOrderGatewayImpl;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProductOrderGatewayImpl);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
