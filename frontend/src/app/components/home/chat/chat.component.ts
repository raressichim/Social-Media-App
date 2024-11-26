import { Component, OnInit } from '@angular/core';
import { WebSocketService } from '../../../services/websocket.service';
import { MatDividerModule } from '@angular/material/divider';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { User } from '../../../interfaces/User';
import { AuthService } from '../../../services/auth.service';
import { Friend } from '../../../interfaces/Friend';
import { FriendselectionService } from '../../../services/friendselection.service';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [MatDividerModule, FormsModule, CommonModule],
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css'],
})
export class ChatComponent implements OnInit {
  messages: any[] = [];
  newMessage: string = '';
  loggedUser: User | null = null;
  selectedFriend: Friend | null = null;

  constructor(
    private webSocketService: WebSocketService,
    private authService: AuthService,
    private friendSelectionService: FriendselectionService
  ) {}

  ngOnInit(): void {
    this.authService.loggedUser$.subscribe((user: User | null) => {
      this.loggedUser = user;
      console.log('ChatComponent received loggedUser: ', this.loggedUser);
    });

    this.friendSelectionService.selectedFriend$.subscribe(
      (friend: Friend | null) => {
        this.selectedFriend = friend;
      }
    );

    this.webSocketService.connect();
    const retryInterval = setInterval(() => {
      if (this.webSocketService['isConnected']) {
        if (this.loggedUser) {
          this.webSocketService.subscribeToPrivateQueue(
            this.loggedUser.email,
            (message) => {
              this.messages.push(message);
              console.log(this.messages);
            }
          );
        }
        clearInterval(retryInterval);
      }
    }, 500);
  }

  sendMessage() {
    if (!this.selectedFriend) {
      console.warn('No friend selected!');
      return;
    }
    const message = {
      senderId: this.loggedUser?.id,
      receiverId: this.selectedFriend.friend.id,
      content: this.newMessage,
    };
    console.log('Sending message:', message);
    this.webSocketService.sendMessage('/app/private-message', message);
    console.log(this.newMessage);
    this.newMessage = '';
  }
}
