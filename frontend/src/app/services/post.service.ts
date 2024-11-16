import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Post } from '../interfaces/Post';

@Injectable({
  providedIn: 'root',
})
export class PostService {
  private postsSubject = new BehaviorSubject<Post[]>([]);
  posts$ = this.postsSubject.asObservable();

  constructor(private http: HttpClient) {}

  addPost(body: string): Observable<Post> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http
      .post<any>(
        'http://localhost:8080/api/posts',
        { body },
        {
          headers,
          withCredentials: true,
        }
      )
      .pipe(
        tap((newPost) => {
          const currentPosts = this.postsSubject.value;
          this.postsSubject.next([newPost, ...currentPosts]);
        })
      );
  }

  getPosts(): Observable<any> {
    return this.http
      .get<Post[]>('http://localhost:8080/api/friends/posts', {
        withCredentials: true,
      })
      .pipe(tap((posts) => this.postsSubject.next(posts)));
  }
}
