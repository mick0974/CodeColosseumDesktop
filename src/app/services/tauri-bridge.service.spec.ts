import { TestBed } from '@angular/core/testing';

import { TauriBridgeService } from './tauri-bridge.service';

describe('TauriBridgeService', () => {
  let service: TauriBridgeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TauriBridgeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
