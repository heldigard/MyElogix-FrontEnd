import { TestBed } from '@angular/core/testing';

import { RoleModelService } from './role-model.service';

describe('RoleModelService', () => {
  let service: RoleModelService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RoleModelService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
