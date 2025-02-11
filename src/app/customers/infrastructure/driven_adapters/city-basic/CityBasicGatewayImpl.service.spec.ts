import { TestBed } from '@angular/core/testing';

import { CityBasicGatewayImpl } from './CityBasicGatewayImpl.service';

describe('CityBasicGatewayImpl', () => {
  let service: CityBasicGatewayImpl;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CityBasicGatewayImpl);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
