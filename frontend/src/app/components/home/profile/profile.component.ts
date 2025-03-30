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
import { FormsModule } from '@angular/forms';
import { FileService } from '../../../services/file.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [MatDivider, CommonModule, FormsModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css',
})
export class ProfileComponent {
  posts: Post[] = [];
  userId: number | null = null;
  user: User | null = null;
  loggedUser: User | null = null;
  fileUrl = '';
  file = '';

  constructor(
    private postService: PostService,
    private userIdService: UserIdServiceService,
    private userService: UserService,
    private friendService: FriendService,
    private authService: AuthService,
    private fileService: FileService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.authService.getLoggedUser();
    this.authService.loggedUser$.subscribe((logged: User | null) => {
      this.loggedUser = logged;
    });
    this.route.paramMap.subscribe((params) => {
      this.userId = Number(params.get('userId'));
      this.userService.getUserById(this.userId).subscribe((tempUser) => {
        this.user = tempUser;
      });
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
    });
  }

  requestFriend(): void {
    this.friendService.requestFriend(this.userId).subscribe();
  }

  areAlreadyFriends(): boolean {
    return this.friendService.areAlreadyFriends(this.userId);
  }

  checkFriends() {
    console.log(this.areAlreadyFriends());
  }

  onFileSelected(event: any) {
    this.file = event.target.files[0];
    if (this.file) {
      this.user!.picture = this.file;
    }
  }

  saveProfile() {
    const formData = new FormData();
    formData.append('file', this.file);
    this.userService.editUser(this.user).subscribe();
    this.fileService.upload(formData).subscribe((response) => {
      this.user!.picture = 'http://localhost:8080/api/files' + response.fileUrl;
      console.log(response.fileUrl);
    });
  }
}
