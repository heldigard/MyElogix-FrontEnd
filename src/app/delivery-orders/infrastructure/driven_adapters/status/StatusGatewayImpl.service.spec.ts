import { TestBed } from '@angular/core/testing';

import { StatusGatewayImpl } from './StatusGatewayImpl.service';

describe('StatusGatewayImpl', () => {
  let service: StatusGatewayImpl;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StatusGatewayImpl);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
