import { Component } from '@angular/core';
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

  constructor(private addPost: PostService) {}

  onClick(): void {
    this.addPost.addPost(this.body).subscribe({
      next: (response) => {
        console.log('Post added');
        this.body = ''; // Clear the input after posting
      },
      error: (error) => {
        console.error('Failed to add post');
      },
    });
  }
}
