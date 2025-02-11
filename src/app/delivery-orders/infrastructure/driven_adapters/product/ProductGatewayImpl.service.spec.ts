import { TestBed } from '@angular/core/testing';

import { ProductGatewayImpl } from './ProductGatewayImpl.service';

describe('ProductGatewayImpl', () => {
  let service: ProductGatewayImpl;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProductGatewayImpl);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
