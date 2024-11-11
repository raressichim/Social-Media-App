import { Component } from '@angular/core';
import { PostService } from '../../../../services/post.service';
import { Post } from './Post';
import { CommonModule } from '@angular/common';
import { formatDistanceToNow } from 'date-fns';

@Component({
  selector: 'app-post-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './post-list.component.html',
  styleUrl: './post-list.component.css',
})
export class PostListComponent {
  [x: string]: any;
  posts: Post[] = [];

  constructor(private postService: PostService) {}

  ngOnInit(): void {
    this.postService.getPosts().subscribe({
      next: (posts) => {
        this.posts = posts.map((post: { date: string | number | Date }) => ({
          ...post,
          relativeTime: formatDistanceToNow(new Date(post.date), {
            addSuffix: true,
          }),
        }));
      },
      error: (error) => {
        console.log('Error fetcin posts', error);
      },
    });
  }
}
