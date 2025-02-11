import { TestBed } from '@angular/core/testing';

import { MeasureDetailGatewayImpl } from './MeasureDetailGatewayImpl.service';

describe('MeasureDetailGatewayImpl', () => {
  let service: MeasureDetailGatewayImpl;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MeasureDetailGatewayImpl);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
