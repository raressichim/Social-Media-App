import { Component } from '@angular/core';
import { MatDivider } from '@angular/material/divider';
import { PostService } from '../../../services/post.service';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/auth.service';
import { User } from '../../../interfaces/User';
import { ActivatedRoute } from '@angular/router';
import { UserIdServiceService } from '../../../services/userId.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [MatDivider, CommonModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css',
})
export class ProfileComponent {
  posts: any[] = [];
  userId: number | null = null;

  constructor(
    private postService: PostService,
    private userIdService: UserIdServiceService
  ) {}

  ngOnInit(): void {
    this.userIdService.userId$.subscribe((userId) => {
      this.userId = userId;
      if (this.userId !== null) {
        this.postService.getPostsForUser(this.userId).subscribe(
          (data) => {
            this.posts = data;
          },
          (error) => {
            console.error('Error fetching posts: ', error);
          }
        );
      } else {
        console.error('User ID is null');
      }
    });
  }
}
