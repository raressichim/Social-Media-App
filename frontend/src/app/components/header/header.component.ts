import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  ViewChild,
} from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { MatFormField } from '@angular/material/form-field';
import { MatIcon, MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { MatInput, MatInputModule } from '@angular/material/input';
import { MatButton } from '@angular/material/button';
import { User } from '../../interfaces/User';
import { UserService } from '../../services/user.service';
import {
  MatList,
  MatListItem,
  MatListSubheaderCssMatStyler,
  MatNavList,
} from '@angular/material/list';
import { MatDivider } from '@angular/material/divider';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { UserIdServiceService } from '../../services/userId.service';
import {
  trigger,
  animate,
  state,
  style,
  transition,
} from '@angular/animations';
import { FriendService } from '../../services/friend.service';
import { Friendship } from '../../interfaces/FriendShip';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    RouterLink,
    MatFormField,
    MatIcon,
    FormsModule,
    MatInput,
    MatButton,
    MatIconModule,
    MatInputModule,
    MatList,
    MatListItem,
    MatDivider,
    MatListSubheaderCssMatStyler,
    MatNavList,
    CommonModule,
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
  animations: [
    trigger('fadeInOut', [
      state(
        'void',
        style({
          opacity: 0,
        })
      ),
      transition('void <=> *', [animate(200)]),
    ]),
  ],
})
export class HeaderComponent {
  @ViewChild('searchIcon') searchIcon!: ElementRef;
  @ViewChild('friendList') friendList!: ElementRef;
  search: String = '';
  filteredUsers: User[] = [];
  allUsers: User[] = [];
  userId: number | null = null;
  loggedUser: User | null = null;
  showSearch: boolean = false;
  isCollapsed = false;
  friendRequestList: Friendship[] = [];
  friendRequestCounter = 0;
  isProfileMenuOpen = false;

  constructor(
    private userService: UserService,
    private router: Router,
    private authService: AuthService,
    private userIdService: UserIdServiceService,
    private friendService: FriendService,
    private cd: ChangeDetectorRef
  ) {
    this.filteredUsers = this.allUsers;
  }

  trackByUser(index: number, user: any): number {
    return user.id;
  }

  ngOnInit(): void {
    this.authService.getLoggedUser();
    this.authService.loggedUser$.subscribe((user: User | null) => {
      this.loggedUser = user;
      console.log(this.loggedUser);
      console.log(user);
      this.userId = this.loggedUser?.id ?? null;
    });
    this.userService.getUsers().subscribe({
      next: (users) => {
        this.allUsers = users;
      },
      error: (err) => {
        console.error('Error fetching friends:', err);
      },
    });
    this.friendService.friendRequests$.subscribe((request) => {
      this.friendRequestList = request;
      this.friendRequestCounter = this.friendRequestList.length;
    });
  }
  getFriendRequests() {
    this.friendService.getFriendRequests();
  }

  acceptFriendship(friendship: Friendship) {
    this.friendService
      .acceptFriendship(friendship.user.id)
      .subscribe((response) => {
        this.friendService.addFriend(response);
        this.friendService.getFriendRequests();
      });
  }

  declineFriendship(id: number) {
    this.friendService.declineFriendship(id).subscribe((response) => {
      console.log(response);
      this.friendService.getFriendRequests();
    });
  }

  toggleProfileMenu() {
    this.isProfileMenuOpen = !this.isProfileMenuOpen;
  }

  logout() {
    this.authService.logout().subscribe(() => {
      this.router.navigate(['/']);
    });

    this.isProfileMenuOpen = !this.isProfileMenuOpen;
    this.loggedUser = null;
  }

  goToProfile(id: number | undefined) {
    console.log(id);
    if (this.userId !== null) {
      this.userIdService.setUserId(this.userId);
      this.router.navigate([`/home/profile/${this.userId}`]);
      this.isProfileMenuOpen = !this.isProfileMenuOpen;
    } else {
      console.error('User ID is null');
    }
  }

  goToUserProfile(userId: number) {
    this.userIdService.setUserId(userId);
    this.filteredUsers = [];
    this.showSearch = false;
    this.searchIcon.nativeElement.style.display = 'inline';
    this.search = '';
    this.router.navigate([`/home/profile/${userId}`]);
  }

  filterResults(text: string) {
    if (!text) {
      this.filteredUsers = [];
      return;
    }

    for (let i = 0; i < this.allUsers.length; i++) {
      if (this.allUsers[i].id === this.loggedUser?.id) {
        this.allUsers.splice(i, 1);
      }
    }

    this.filteredUsers = this.allUsers.filter((user) =>
      user?.firstName
        .toLowerCase()
        .concat(' ')
        .concat(user?.lastName.toLowerCase())
        .includes(text.toLowerCase())
    );
  }

  toggleSearch() {
    this.showSearch = !this.showSearch;
    this.searchIcon.nativeElement.style.setProperty(
      'display',
      'none',
      'important'
    );
    console.log(this.searchIcon.nativeElement.style.display);
  }
}
