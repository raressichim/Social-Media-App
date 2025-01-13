import { Routes } from '@angular/router';
import { SigninComponent } from './components/signin/signin.component';
import { SignupComponent } from './components/signup/signup.component';
import { FeedComponent } from './components/home/feed/feed.component';
import { ProfileComponent } from './components/home/profile/profile.component';

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
  { path: 'home/profile/:userId', component: ProfileComponent },
  {
    path: 'signup',
    loadComponent: () => {
      return import('./components/signup/signup.component').then(
        (m) => m.SignupComponent
      );
    },
  },
  {
    path: 'home',
    loadComponent: () => {
      return import('./components/home/home.component').then(
        (m) => m.HomeComponent
      );
    },
    children: [
      { path: '', redirectTo: 'feed', pathMatch: 'full' },
      { path: 'feed', component: FeedComponent },
      { path: 'profile', component: ProfileComponent },
    ],
  },
];
