import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: HttpClient) {}

  login(email: string, password: string): Observable<any> {
    const loginUrl: string = 'http://localhost:8080/api/auth/login';
    const body = { email, password };
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    return this.http.post<any>(loginUrl, body, {
      headers,
      withCredentials: true,
    });
  }

  logout(): Observable<any> {
    const logoutUrl: string = 'http://localhost:8080/api/auth/logout';
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<any>(logoutUrl, headers, { withCredentials: true });
  }
}
