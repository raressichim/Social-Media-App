import { Component } from '@angular/core';
import { SidebarComponent } from './sidebar/sidebar.component';
import { FeedComponent } from './feed/feed.component';
import { FriendListComponent } from './friend-list/friend-list.component';
import { ChatComponent } from './chat/chat.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    SidebarComponent,
    FeedComponent,
    FriendListComponent,
    ChatComponent,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {}
