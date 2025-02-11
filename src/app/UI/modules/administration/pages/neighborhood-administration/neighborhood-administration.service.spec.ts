import { TestBed } from '@angular/core/testing';

import { NeighborhoodAdministrationService } from './neighborhood-administration.service';

describe('NeighborhoodAdministrationService', () => {
  let service: NeighborhoodAdministrationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NeighborhoodAdministrationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
