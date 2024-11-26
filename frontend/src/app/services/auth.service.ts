import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { User } from '../interfaces/User';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private loggedUserSubject = new BehaviorSubject<User | null>(null);
  public loggedUser$ = this.loggedUserSubject.asObservable();
  constructor(private http: HttpClient) {}

  login(email: string, password: string): Observable<any> {
    const loginUrl: string = 'http://localhost:8080/api/auth/login';
    const body = { email, password };
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    return this.http
      .post<User>(loginUrl, body, {
        headers,
        withCredentials: true,
      })
      .pipe(
        tap((user: User) => {
          this.loggedUserSubject.next(user);
        })
      );
  }

  logout(): Observable<any> {
    const logoutUrl: string = 'http://localhost:8080/api/auth/logout';
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<any>(logoutUrl, headers, { withCredentials: true });
  }

  getLoggedUser(): User | null {
    return this.loggedUserSubject.value;
  }
}
