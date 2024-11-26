import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Friend } from '../interfaces/Friend';

@Injectable({
  providedIn: 'root',
})
export class FriendselectionService {
  private selectedFriendSubject = new BehaviorSubject<Friend | null>(null);
  selectedFriend$ = this.selectedFriendSubject.asObservable();

  selectFriend(friend: Friend): void {
    this.selectedFriendSubject.next(friend);
  }

  getSelectedFriend(): Friend | null {
    return this.selectedFriendSubject.value;
  }
}
