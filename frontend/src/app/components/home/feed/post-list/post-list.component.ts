import { Component } from '@angular/core';
import { PostService } from '../../../../services/post.service';
import { Post } from '../../../../interfaces/Post';
import { CommonModule } from '@angular/common';
import { add, formatDistanceToNow } from 'date-fns';
import { OnInit } from '../../../../interfaces/OnInit';
import { Comment } from '../../../../interfaces/comment';
import { CommentService } from '../../../../services/comment.service';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
} from '@angular/forms';

@Component({
  selector: 'app-post-list',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './post-list.component.html',
  styleUrl: './post-list.component.css',
})
export class PostListComponent implements OnInit {
  posts: Post[] = [];
  commentsByPostId: { [postId: number]: Comment[] } = [];
  addComment = new FormGroup({
    content: new FormControl(''),
  });

  constructor(
    private postService: PostService,
    private commentService: CommentService,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    this.postService.getPosts().subscribe({
      error: (error) => {
        console.log('Error fetching posts', error);
      },
    });

    this.postService.posts$.subscribe({
      next: (posts) => {
        this.posts = posts.map((post) => ({
          ...post,
          relativeTime: formatDistanceToNow(new Date(post.date), {
            addSuffix: true,
          }),
        }));
        this.posts.forEach((post) => {
          this.commentService.getCommentsForPost(post).subscribe((comms) => {
            this.commentsByPostId[post.id] = comms;
          });
        });
      },

      error: (error) => {
        console.log('Error updating posts', error);
      },
    });
  }

  onSubmit(postId: number): void {
    this.commentService
      .addComment(postId, this.addComment.get('content')?.value || '')
      .subscribe((response) => {
        this.commentsByPostId[postId] = [
          ...(this.commentsByPostId[postId] || []),
          response,
        ];
      });
    this.addComment.reset();
  }
}
