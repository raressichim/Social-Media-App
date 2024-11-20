import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import {MatFormField} from '@angular/material/form-field';
import {MatIcon, MatIconModule} from '@angular/material/icon';
import {FormsModule} from '@angular/forms';
import {MatInput, MatInputModule} from '@angular/material/input';
import {MatButton} from '@angular/material/button';
import {User} from '../../interfaces/User';
import {UserService} from '../../services/user.service';
import {MatList, MatListItem, MatListSubheaderCssMatStyler} from '@angular/material/list';
import {MatDivider} from '@angular/material/divider';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, MatFormField, MatIcon, FormsModule, MatInput, MatButton, MatIconModule, MatInputModule, MatList, MatListItem, MatDivider, MatListSubheaderCssMatStyler],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent {
  search: String = '';
  filteredUsers: User[] = [];
  allUsers: User[] = [];

  constructor(private userService: UserService) {
    this.filteredUsers = this.allUsers;
  }

  ngOnInit(): void {
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

  filterResults(text: string) {
    if (!text) {
      this.filteredUsers = this.allUsers;
      return;
    }

    this.filteredUsers = this.allUsers.filter(
      user => user?.firstName.toLowerCase().concat(" ").concat(user?.lastName.toLowerCase()).includes(text.toLowerCase())
    );
    console.log(this.filteredUsers);
  }
}
