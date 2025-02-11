import { TestBed } from '@angular/core/testing';

import { MetricUnitGatewayImpl } from './MetricUnitGatewayImpl.service';

describe('MetricUnitGatewayImpl', () => {
  let service: MetricUnitGatewayImpl;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MetricUnitGatewayImpl);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
