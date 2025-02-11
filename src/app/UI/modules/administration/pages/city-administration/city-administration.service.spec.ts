import { TestBed } from '@angular/core/testing';

import { CityAdministrationService } from './city-administration.service';

describe('CityAdministrationService', () => {
  let service: CityAdministrationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CityAdministrationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
