import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signin',
  standalone: true,
  imports: [RouterLink, FormsModule],
  templateUrl: './signin.component.html',
  styleUrl: './signin.component.css',
})
export class SigninComponent {
  email: string = '';
  password: string = '';
  constructor(private authService: AuthService, private router: Router) {}

  onSubmit(): void {
    this.authService.login(this.email, this.password).subscribe({
      next: (response) => {
        console.log(`Login successful for ${this.email}`, response);
        this.router.navigate(['/home']);
      },
      error: (error) => {
        console.error(`Login failed for ${this.email}`, error);
      },
    });
  }

  onForgotPassword(): void {
    this.authService.logout().subscribe({
      next: (response) => {
        console.log(`Logout successfully for ${this.email}`, response);
      },
      error: (error) => {
        console.error(`Logout failed for ${this.email}`, error);
      },
    });
  }
}
