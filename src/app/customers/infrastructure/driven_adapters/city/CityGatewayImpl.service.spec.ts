import { TestBed } from '@angular/core/testing';

import { CityGatewayImpl } from './CityGatewayImpl.service';

describe('CityGatewayImpl', () => {
  let service: CityGatewayImpl;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CityGatewayImpl);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
