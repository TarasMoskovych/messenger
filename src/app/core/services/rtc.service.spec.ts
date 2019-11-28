import { TestBed } from '@angular/core/testing';

import { RtcService } from './rtc.service';

describe('RtcService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: RtcService = TestBed.get(RtcService);
    expect(service).toBeTruthy();
  });
});
