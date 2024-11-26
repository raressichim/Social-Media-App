import { TestBed } from '@angular/core/testing';

import { FriendselectionService } from './friendselection.service';

describe('FriendselectionService', () => {
  let service: FriendselectionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FriendselectionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
