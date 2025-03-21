import { Injectable } from '@angular/core';
import { Message, Stomp } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

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
      const destination = `/user/${email}/queue/messages`;
      this.stompClient.subscribe(destination, (message: Message) => {
        const parsedMessage = JSON.parse(message.body);
        console.log('Message' + message.body);
        messageHandler(parsedMessage);
        console.log('Received message: ', parsedMessage);
      });
    } else {
      console.warn('No email!');
    }
  }

  disconnect() {
    if (this.stompClient) {
      this.stompClient.disconnect(() => {
        console.log('Disconnected from WebSocket');
      });
    }
  }
}
