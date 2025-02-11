import { TestBed } from '@angular/core/testing';

import { DocumentTypeGatewayImpl } from './DocumentTypeGatewayImpl.service';

describe('DocumentTypeGatewayImpl', () => {
  let service: DocumentTypeGatewayImpl;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DocumentTypeGatewayImpl);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
