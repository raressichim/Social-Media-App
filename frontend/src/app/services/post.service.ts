import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class PostService {
  constructor(private http: HttpClient) {}

  addPost(body: string): Observable<any> {
    const newPostUrl = 'http://localhost:8080/api/posts';
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<any>(
      newPostUrl,
      { body },
      {
        headers,
        withCredentials: true,
      }
    );
  }

  getPosts(): Observable<any> {
    const postUrl = 'http://localhost:8080/api/posts';
    return this.http.get<any>(postUrl, {
      withCredentials: true,
    });
  }
}
