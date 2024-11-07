import {Component} from '@angular/core';
import {HeaderComponent} from '../header/header.component';
import {FormsModule} from '@angular/forms';
import {RegisterService} from '../../services/register.service';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [HeaderComponent, FormsModule],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css',
})
export class SignupComponent {
  constructor(private registerService: RegisterService) {
  }

  onSubmit(): void {
    this.registerService.register().subscribe({
      next: (response) => {
        console.log(response);
      },
      error: (error) => {
        console.error(error);
      }
    });
  }
}
