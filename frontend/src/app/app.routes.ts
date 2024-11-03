import { Routes } from '@angular/router';
import { SigninComponent } from './components/signin/signin.component';
import { SignupComponent } from './components/signup/signup.component';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    loadComponent: () => {
      return import('./components/signin/signin.component').then(
        (m) => m.SigninComponent
      );
    },
  },
  {
    path: 'signup',
    loadComponent: () => {
      return import('./components/signup/signup.component').then(
        (m) => m.SignupComponent
      );
    },
  },
];
