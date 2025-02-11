import { TestBed } from '@angular/core/testing';

import { AuthenticationImplService } from './authentication-impl.service';

describe('AuthenticationImplService', () => {
  let service: AuthenticationImplService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuthenticationImplService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
