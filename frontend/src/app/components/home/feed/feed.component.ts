import { Component } from '@angular/core';
import { NewPostComponent } from './new-post/new-post.component';
import { PostListComponent } from './post-list/post-list.component';

@Component({
  selector: 'app-feed',
  standalone: true,
  imports: [NewPostComponent, PostListComponent],
  templateUrl: './feed.component.html',
  styleUrl: './feed.component.css',
})
export class FeedComponent {}
