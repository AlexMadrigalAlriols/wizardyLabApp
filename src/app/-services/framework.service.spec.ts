import { TestBed } from '@angular/core/testing';

import { FrameworkService } from './framework.service';

describe('FrameworkService', () => {
  let service: FrameworkService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FrameworkService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
