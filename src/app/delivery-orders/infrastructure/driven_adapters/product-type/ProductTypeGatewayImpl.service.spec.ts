import { TestBed } from '@angular/core/testing';

import { ProductTypeGatewayImpl } from './ProductTypeGatewayImpl.service';

describe('ProductTypeGatewayImpl', () => {
  let service: ProductTypeGatewayImpl;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProductTypeGatewayImpl);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
