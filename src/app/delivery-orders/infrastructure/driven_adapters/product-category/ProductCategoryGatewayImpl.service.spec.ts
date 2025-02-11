import { TestBed } from '@angular/core/testing';
import { ProductCategoryGatewayImpl } from './ProductCategoryGatewayImpl.service';

describe('ProductGatewayImpl', () => {
  let service: ProductCategoryGatewayImpl;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProductCategoryGatewayImpl);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
