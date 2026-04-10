import { TestBed } from '@angular/core/testing';

import { TicTac } from './tic-tac';

describe('TicTac', () => {
  let service: TicTac;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TicTac);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
