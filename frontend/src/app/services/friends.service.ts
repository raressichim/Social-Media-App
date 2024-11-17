import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Friend } from '../interfaces/Friend';

@Injectable({
  providedIn: 'root',
})
export class FriendsService {
  constructor(private http: HttpClient) {}

  getFriends(): Observable<any> {
    return this.http.get<Friend[]>('http://localhost:8080/api/friends', {
      withCredentials: true,
    });
  }
}
