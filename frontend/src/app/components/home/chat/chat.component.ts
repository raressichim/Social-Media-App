import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import { WebSocketService } from '../../../services/websocket.service';
import { MatDividerModule } from '@angular/material/divider';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { User } from '../../../interfaces/User';
import { AuthService } from '../../../services/auth.service';
import { Friend } from '../../../interfaces/Friend';
import { FriendselectionService } from '../../../services/friendselection.service';
import { HttpClient } from '@angular/common/http';
import { Message } from '../../../interfaces/Message';
import {MatIcon} from '@angular/material/icon';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [MatDividerModule, FormsModule, CommonModule, MatIcon],
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css'],
})
export class ChatComponent implements OnInit {
  @ViewChild('messageList') messageList!: ElementRef;
  @ViewChild('chatContainer') chatContainer!: ElementRef;
  messages: any[] = [];
  newMessage: string = '';
  loggedUser: User | null = null;
  selectedFriend: Friend | null = null;
  attachment: string | null = null;

  constructor(
    private webSocketService: WebSocketService,
    private authService: AuthService,
    private friendSelectionService: FriendselectionService,
    private cdr: ChangeDetectorRef,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.authService.loggedUser$.subscribe((user: User | null) => {
      this.loggedUser = user;
      console.log('ChatComponent received loggedUser: ', this.loggedUser);
    });

    this.friendSelectionService.selectedFriend$.subscribe(
      (friend: Friend | null) => {
        this.selectedFriend = friend;
        if (friend) {
          this.fetchMessages(friend.friend.id);
        } else {
          this.messages = [];
        }
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
              this.scrollToBottom();
            }
          );
        }
        clearInterval(retryInterval);
      }
    }, 500);
  }

  fetchMessages(receiverId: number): void {
    this.messages = [];
    this.http
      .get<Message[]>(`http://localhost:8080/api/messages/${receiverId}`, {
        withCredentials: true,
        observe: 'body',
        responseType: 'json',
      })
      .subscribe({
        next: (response) => {
          this.messages = response;
          this.scrollToBottom();
        },
        error: (err) => {
          console.error('Error fetching messages:', err);
        },
      });
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
      attachment: this.attachment,
    };
    console.log('Sending message:', message);
    this.webSocketService.sendMessage('/app/private-message', message);
    console.log(this.newMessage);
    this.newMessage = '';
    this.scrollToBottom();
  }

  private scrollToBottom() {
    this.cdr.detectChanges();
    setTimeout(() => {
      if (this.messageList) {
        const element = this.messageList.nativeElement;
        element.scrollTop = element.scrollHeight;
        console.log(
          'Scroll position:',
          element.scrollTop,
          element.scrollHeight
        );
      }
    }, 0);
  }

  ngAfterViewInit() {
    console.log('Message list element:', this.messageList);
    this.scrollToBottom();
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      const reader = new FileReader();

      reader.onload = () => {
        const base64File = reader.result as string;
        this.attachment = base64File.split(',')[1]; // Strip the Base64 prefix
        console.log('Prepared attachment:', this.attachment);
      };
      reader.readAsDataURL(file);
  }
  }
}
