import { TestBed } from '@angular/core/testing';

import { UtcConverterService } from './utc-converter.service';

describe('UtcConverterService', () => {
  let service: UtcConverterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UtcConverterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
