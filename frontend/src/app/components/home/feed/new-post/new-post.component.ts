import {Component, Inject, Injectable} from '@angular/core';
import { PostService } from '../../../../services/post.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-new-post',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './new-post.component.html',
  styleUrl: './new-post.component.css',
})
export class NewPostComponent {
  body: string = '';

  constructor(private postService: PostService) {}

  onClick(): void {
    this.postService.addPost(this.body).subscribe({
      next: () => {
        console.log('Post added');
        this.body = '';
      },
      error: () => {
        console.error('Failed to add post');
      },
    });
  }
}
