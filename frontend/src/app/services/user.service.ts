import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { User } from '../interfaces/User';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private http: HttpClient) {}

  getUsers(): Observable<any> {
    return this.http.get<User[]>('http://localhost:8080/api/users', {
      withCredentials: true,
    });
  }

  getUserById(id: number): Observable<any> {
    return this.http.get<User>(`http://localhost:8080/api/users/${id}`, {
      withCredentials: true,
    });
  }

  editUser(user: User | null): Observable<any> {
    return this.http.post<any>('http://localhost:8080/api/users/edit', user, {
      withCredentials: true,
    });
  }
}
