import { Component } from '@angular/core';
import { SidebarComponent } from './sidebar/sidebar.component';
import { FeedComponent } from './feed/feed.component';
import { FriendListComponent } from './friend-list/friend-list.component';
import { ChatComponent } from './chat/chat.component';
import { MatCommonModule } from '@angular/material/core';
import { CommonModule } from '@angular/common';
import { Friend } from '../../interfaces/Friend';
import { FriendselectionService } from '../../services/friendselection.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    SidebarComponent,
    FeedComponent,
    FriendListComponent,
    ChatComponent,
    CommonModule,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {
  selectedFriend: Friend | null = null;

  constructor(private friendSelectionService: FriendselectionService) {}

  ngOnInit(): void {
    this.friendSelectionService.selectedFriend$.subscribe(
      (friend: Friend | null) => {
        this.selectedFriend = friend;
      }
    );
  }
}
