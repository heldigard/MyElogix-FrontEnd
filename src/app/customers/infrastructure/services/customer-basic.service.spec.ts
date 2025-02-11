import { TestBed } from '@angular/core/testing';

import { CustomerBasicService } from './customer-basic.service';

describe('CustomerBasicService', () => {
  let service: CustomerBasicService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CustomerBasicService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
