import { TestBed } from '@angular/core/testing';

import { EmmployeeService } from './emmployee.service';

describe('EmmployeeService', () => {
  let service: EmmployeeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EmmployeeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
