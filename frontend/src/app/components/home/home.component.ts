import { Component } from '@angular/core';
import { SidebarComponent } from './sidebar/sidebar.component';
import { FeedComponent } from './feed/feed.component';
import { FriendListComponent } from './friend-list/friend-list.component';
import { ChatComponent } from './chat/chat.component';
import { MatCommonModule } from '@angular/material/core';
import { CommonModule } from '@angular/common';
import { Friendship } from '../../interfaces/FriendShip';
import { FriendselectionService } from '../../services/friendselection.service';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    SidebarComponent,
    FeedComponent,
    FriendListComponent,
    ChatComponent,
    CommonModule,
    RouterOutlet,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {
  selectedFriend: Friendship | null = null;

  constructor(private friendSelectionService: FriendselectionService) {}

  ngOnInit(): void {
    this.friendSelectionService.selectedFriend$.subscribe(
      (friend: Friendship | null) => {
        this.selectedFriend = friend;
      }
    );
  }
}
