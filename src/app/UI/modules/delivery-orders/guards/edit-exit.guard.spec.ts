import { TestBed } from '@angular/core/testing';
import { CanDeactivateFn } from '@angular/router';

import { editExitGuard } from './edit-exit.guard';

describe('editExitGuard', () => {
  const executeGuard: CanDeactivateFn<any> = (...guardParameters) =>
    TestBed.runInInjectionContext(() => editExitGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
