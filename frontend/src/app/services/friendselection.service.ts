import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Friendship } from '../interfaces/FriendShip';

@Injectable({
  providedIn: 'root',
})
export class FriendselectionService {
  private selectedFriendSubject = new BehaviorSubject<Friendship | null>(null);
  selectedFriend$ = this.selectedFriendSubject.asObservable();

  selectFriend(friend: Friendship | null): void {
    this.selectedFriendSubject.next(friend);
  }

  getSelectedFriend(): Friendship | null {
    return this.selectedFriendSubject.value;
  }
}
