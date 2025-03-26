import { Component } from '@angular/core';
import { MatDivider } from '@angular/material/divider';
import { PostService } from '../../../services/post.service';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/auth.service';
import { User } from '../../../interfaces/User';
import { ActivatedRoute } from '@angular/router';
import { UserIdServiceService } from '../../../services/userId.service';
import { UserService } from '../../../services/user.service';
import { formatDistanceToNow } from 'date-fns';
import { Post } from '../../../interfaces/Post';
import { FriendService } from '../../../services/friend.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [MatDivider, CommonModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css',
})
export class ProfileComponent {
  posts: Post[] = [];
  userId: number | null = null;
  user: User | null = null;
  loggedUser: User | null = null;

  constructor(
    private postService: PostService,
    private userIdService: UserIdServiceService,
    private userService: UserService,
    private friendService: FriendService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.authService.loggedUser$.subscribe((logged: User | null) => {
      this.loggedUser = logged;
    });
    this.userIdService.userId$.subscribe((userId) => {
      this.userId = userId;
      if (this.userId !== null) {
        this.postService.getPostsForUser(this.userId).subscribe(
          (data) => {
            this.posts = data.map((post: Post) => ({
              ...post,
              relativeTime: formatDistanceToNow(new Date(post.date), {
                addSuffix: true,
              }),
            }));
          },
          (error) => {
            console.error('Error fetching posts: ', error);
          }
        );
        this.userService.getUserById(this.userId).subscribe((user) => {
          this.user = user;
        });
      } else {
        console.error('User ID is null');
      }
    });
  }

  requestFriend(): void {
    this.friendService.requestFriend(this.userId).subscribe((response) => {
      console.log(response);
    });
  }

  areAlreadyFriends(): boolean {
    return this.friendService.areAlreadyFriends(this.userId);
  }

  checkFriends() {
    console.log(this.areAlreadyFriends());
  }
}
