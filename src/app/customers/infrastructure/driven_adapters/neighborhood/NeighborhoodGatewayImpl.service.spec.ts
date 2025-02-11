import { TestBed } from '@angular/core/testing';

import { NeighborhoodGatewayImpl } from './NeighborhoodGatewayImpl.service';
describe('NeighborhoodGatewayImpl', () => {
  let service: NeighborhoodGatewayImpl;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NeighborhoodGatewayImpl);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
