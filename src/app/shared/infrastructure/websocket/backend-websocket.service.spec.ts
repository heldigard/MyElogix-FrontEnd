import { TestBed } from '@angular/core/testing';

import { BackendWebsocketService } from './backend-websocket.service';

describe('BackendWebsocketService', () => {
  let service: BackendWebsocketService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BackendWebsocketService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
