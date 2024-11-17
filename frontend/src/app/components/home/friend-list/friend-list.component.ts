import { Component } from '@angular/core';
import { Friend } from '../../../interfaces/Friend';
import { FriendsService } from '../../../services/friends.service';

@Component({
  selector: 'app-friend-list',
  standalone: true,
  imports: [],
  templateUrl: './friend-list.component.html',
  styleUrl: './friend-list.component.css',
})
export class FriendListComponent {
  friends: Friend[] = [];

  constructor(private friendService: FriendsService) {}

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
}
