import { Component } from '@angular/core';
import { PostService } from '../../../../services/post.service';
import { Post } from '../../../../interfaces/Post';
import { CommonModule } from '@angular/common';
import { formatDistanceToNow } from 'date-fns';
import { OnInit } from '../../../../interfaces/OnInit';

@Component({
  selector: 'app-post-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './post-list.component.html',
  styleUrl: './post-list.component.css',
})
export class PostListComponent implements OnInit {
  posts: Post[] = [];

  constructor(private postService: PostService) {}

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
      },
      error: (error) => {
        console.log('Error updating posts', error);
      },
    });
  }
}
