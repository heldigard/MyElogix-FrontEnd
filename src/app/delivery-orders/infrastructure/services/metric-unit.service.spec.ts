import { TestBed } from '@angular/core/testing';

import { MetricUnitService } from './metric-unit.service';

describe('MetricUnitService', () => {
  let service: MetricUnitService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MetricUnitService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
