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
import { Friendship } from '../../../interfaces/FriendShip';
import { FriendselectionService } from '../../../services/friendselection.service';
import { HttpClient, HttpEvent, HttpEventType } from '@angular/common/http';
import { Message } from '../../../interfaces/Message';
import { MatIcon } from '@angular/material/icon';
import { map, max, Observable } from 'rxjs';
import { saveAs } from 'file-saver';
import { FileService } from '../../../services/file.service';
import { GoogleMapsModule } from '@angular/google-maps';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [
    MatDividerModule,
    FormsModule,
    CommonModule,
    MatIcon,
    GoogleMapsModule,
  ],
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css'],
})
export class ChatComponent implements OnInit {
  @ViewChild('messageList') messageList!: ElementRef;
  @ViewChild('chatContainer') chatContainer!: ElementRef;
  messages: any[] = [];
  newMessage: string = '';
  loggedUser: User | null = null;
  selectedFriend: Friendship | null = null;
  attachment: string | null = null;
  fileName = '';
  zoom = 15;
  lattitude = 0;
  longitude = 0;

  center: google.maps.LatLngLiteral = {
    lat: this.lattitude,
    lng: this.longitude,
  };

  constructor(
    private webSocketService: WebSocketService,
    private authService: AuthService,
    private friendSelectionService: FriendselectionService,
    private cdr: ChangeDetectorRef,
    private http: HttpClient,
    private fileService: FileService
  ) {}

  ngOnInit(): void {
    this.authService.loggedUser$.subscribe((user: User | null) => {
      this.loggedUser = user;
      console.log('ChatComponent received loggedUser: ', this.loggedUser);
    });

    this.friendSelectionService.selectedFriend$.subscribe(
      (friend: Friendship | null) => {
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

  isImageFile(fileName: string): boolean {
    return /\.(jpg|jpeg|png|gif|bmp|webp)$/i.test(fileName);
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
      type: 'TEXT',
    };
    console.log('Sending message:', message);
    this.webSocketService.sendMessage('/app/private-message', message);
    console.log(this.newMessage);
    this.newMessage = '';
    this.scrollToBottom();
  }

  sendFile(event: any) {
    const file = event.target.files[0];

    if (!file) return;
    if (!this.selectedFriend || !this.loggedUser) {
      console.warn('No friend selected or user not logged in.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    this.http
      .post<{ fileUrl: string }>(
        'http://localhost:8080/api/files/upload',
        formData,
        {
          withCredentials: true,
        }
      )
      .subscribe({
        next: (response) => {
          const message = {
            senderId: this.loggedUser!.id,
            receiverId: this.selectedFriend!.friend.id,
            content: '',
            type: 'FILE',
            fileName: file.name,
            fileUrl: response.fileUrl,
          };
          console.log('FileUrl:' + response.fileUrl);
          console.log('Sending file message:', message.fileName);
          this.webSocketService.sendMessage('/app/private-message', message);
        },
        error: (err) => {
          console.error('File upload error:', err);
        },
      });
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

  downloadFile(fileName: string) {
    console.log(fileName);
    this.fileService.download(fileName).subscribe();
  }

  sendLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const locationMessage = {
          senderId: this.loggedUser!.id,
          receiverId: this.selectedFriend!.friend.id,
          content: ``,
          type: 'LOCATION',
          marker: {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          },
          center: {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          },
        };
        this.webSocketService.sendMessage(
          '/app/private-message',
          locationMessage
        ),
          {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0,
          };
      });
    }
  }

  hideChat() {
    this.chatContainer.nativeElement.style.display = 'none';
    this.friendSelectionService.selectFriend(null);
  }
  ngAfterViewInit() {
    console.log('Message list element:', this.messageList);
    this.scrollToBottom();
  }
}
