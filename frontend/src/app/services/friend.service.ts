import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Friendship } from '../interfaces/FriendShip';
import { User } from '../interfaces/User';

@Injectable({
  providedIn: 'root',
})
export class FriendService {
  constructor(private http: HttpClient) {}

  private friendList = new BehaviorSubject<Friendship[]>([]);
  friends$ = this.friendList.asObservable();

  private friendRequestList = new BehaviorSubject<Friendship[]>([]);
  friendRequests$ = this.friendRequestList.asObservable();

  addFriend(friend: Friendship) {
    this.friendList.next([...this.friendList.value, friend]);
  }

  getFriends(): void {
    this.http
      .get<Friendship[]>('http://localhost:8080/api/friends', {
        withCredentials: true,
      })
      .subscribe((friends) => this.friendList.next(friends));
    this.getFriendRequests();
  }

  requestFriend(userId: Number | null): Observable<User> {
    console.log('Friend request sent!');
    return this.http.post<User>(
      'http://localhost:8080/api/friends/request',
      { userId: userId },
      {
        withCredentials: true,
      }
    );
  }

  areAlreadyFriends(id: number | null) {
    for (let friend of this.friendList.value) {
      if (friend.friend.id === id) {
        return true;
      }
    }
    return false;
  }

  getFriendRequests(): void {
    this.http
      .get<Friendship[]>('http://localhost:8080/api/friends/requests', {
        withCredentials: true,
      })
      .subscribe((request) => {
        console.log(request);
        this.friendRequestList.next(request);
      });
  }

  acceptFriendship(userId: number | null): Observable<any> {
    return this.http.post<any>(
      'http://localhost:8080/api/friends',
      { userId: userId },
      {
        withCredentials: true,
      }
    );
  }

  declineFriendship(userId: number | null): Observable<any> {
    return this.http.post<any>(
      'http://localhost:8080/api/friends/decline',
      { userId: userId },
      {
        withCredentials: true,
        responseType: 'text' as 'json',
      }
    );
  }
}
