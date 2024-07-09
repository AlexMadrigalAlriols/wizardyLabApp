import { TestBed } from '@angular/core/testing';

import { TimerService } from './timer.service';

describe('TimerServiceService', () => {
  let service: TimerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TimerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
