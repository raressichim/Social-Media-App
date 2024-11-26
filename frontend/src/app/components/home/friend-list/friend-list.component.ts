import { Component } from '@angular/core';
import { Friend } from '../../../interfaces/Friend';
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
  friends: Friend[] = [];

  constructor(
    private friendService: FriendService,
    private friendSelectionService: FriendselectionService
  ) {}

  ngOnInit(): void {
    this.friendService.getFriends().subscribe({
      next: (friends) => {
        this.friends = friends;
      },
      error: (err) => {
        console.error('Error fetching friends:', err);
      },
    });
  }

  selectFriend(friend: Friend): void {
    this.friendSelectionService.selectFriend(friend);
  }

  trackById(index: number, friend: Friend): number {
    return friend.friend.id;
  }
}
