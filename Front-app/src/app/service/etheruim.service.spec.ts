import { TestBed } from '@angular/core/testing';

import { EtheruimService } from './etheruim.service';

describe('EtheruimService', () => {
  let service: EtheruimService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EtheruimService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
