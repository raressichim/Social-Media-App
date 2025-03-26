import { Component } from '@angular/core';
import { Friendship } from '../../../interfaces/FriendShip';
import { FriendService } from '../../../services/friend.service';
import { FriendselectionService } from '../../../services/friendselection.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-friend-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './friend-list.component.html',
  styleUrl: './friend-list.component.css',
})
export class FriendListComponent {
  friends: Friendship[] = [];

  constructor(
    private friendService: FriendService,
    private friendSelectionService: FriendselectionService
  ) {}

  ngOnInit(): void {
    this.friendService.getFriends();
    this.friendService.friends$.subscribe((friends) => {
      this.friends = friends;
    });
  }

  selectFriend(friend: Friendship): void {
    this.friendSelectionService.selectFriend(friend);
  }

  trackById(index: number, friend: Friendship): number {
    return friend.friend.id;
  }
}
