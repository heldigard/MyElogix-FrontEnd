import { TestBed } from '@angular/core/testing';

import { ProductAdministrationService } from './product-administration.service';

describe('ProductAdministrationService', () => {
  let service: ProductAdministrationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProductAdministrationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
