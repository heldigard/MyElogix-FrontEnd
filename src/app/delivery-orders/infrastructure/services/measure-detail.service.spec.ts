import { TestBed } from '@angular/core/testing';

import { MeasureDetailService } from './measure-detail.service';

describe('MeasureDetailService', () => {
  let service: MeasureDetailService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MeasureDetailService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
