import { Injectable } from '@angular/core';
import { Post } from '../interfaces/Post';
import { HttpClient } from '@angular/common/http';
import { Comment } from '../interfaces/comment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CommentService {
  constructor(private http: HttpClient) {}

  getCommentsForPost(post: Post): Observable<any> {
    return this.http.get(`http://localhost:8080/api/comments/${post.id}`, {
      withCredentials: true,
    });
  }

  addComment(postId: number, content: string): Observable<any> {
    return this.http.post(
      'http://localhost:8080/api/comments',
      { postId, content },
      { withCredentials: true }
    );
  }
}
