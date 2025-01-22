import { Component } from '@angular/core';
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
  search: String = '';
  filteredUsers: User[] = [];
  allUsers: User[] = [];
  userId: number | null = null;
  loggedUser: User | null = null;
  showSearch: boolean = false;

  constructor(
    private userService: UserService,
    private router: Router,
    private authService: AuthService,
    private userIdService: UserIdServiceService
  ) {
    this.filteredUsers = this.allUsers;
  }

  trackByUser(index: number, user: any): number {
    return user.id;
  }

  ngOnInit(): void {
    this.authService.loggedUser$.subscribe((user: User | null) => {
      this.loggedUser = user;
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
    console.log(this.allUsers);
  }

  goToProfile() {
    if (this.userId !== null) {
      this.userIdService.setUserId(this.userId);
      this.router.navigate(['/home/profile']);
    } else {
      console.error('User ID is null');
    }
  }

  goToUserProfile(userId: number) {
    this.userIdService.setUserId(userId);
    this.router.navigate(['/home/profile']);
  }

  filterResults(text: string) {
    if (!text) {
      this.filteredUsers = [];
      return;
    }

    this.filteredUsers = this.allUsers.filter((user) =>
      user?.firstName
        .toLowerCase()
        .concat(' ')
        .concat(user?.lastName.toLowerCase())
        .includes(text.toLowerCase())
    );
    console.log(this.filteredUsers);
  }

  toggleSearch() {
    this.showSearch = !this.showSearch;
  }
}
