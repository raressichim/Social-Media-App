import { Injectable } from '@angular/core';
import {Message, Stomp} from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class WebSocketService {
  private stompClient: any;
  private isConnected: boolean = false;
  private readonly endpoint = 'http://localhost:8080/chat';

  connect() {
    const socket = new SockJS(this.endpoint);
    this.stompClient = Stomp.over(socket);

    this.stompClient.connect({}, () => {
      console.log('Connected to WebSocket');
      this.isConnected = true;
    });
  }

  sendMessage(destination: string, message: any) {
    this.stompClient.send(destination, {}, JSON.stringify(message));
  }

  subscribeToPrivateQueue(
    email: string | undefined,
    messageHandler: (message: any) => void
  ) {
    if (email) {
      console.log('USER EMAIL' + email);
      const destination = `/user/${email}/queue/messages`;
      console.log('Subscribing to destination:', destination);
      this.stompClient.subscribe(destination, (message: any) => {
        const parsedMessage = JSON.parse(message.body);
        messageHandler(parsedMessage);
        console.log(parsedMessage);
      });
    } else {
      console.warn('No email!');
    }
  }

  subscribeToUserQueue(queueName: string): Observable<any> {
    return new Observable(observer => {
      this.stompClient.subscribe(queueName, (message: Message) => {
        observer.next(JSON.parse(message.body));
      });
    });
  }

  disconnect() {
    if (this.stompClient) {
      this.stompClient.disconnect(() => {
        console.log('Disconnected from WebSocket');
      });
    }
  }
}
