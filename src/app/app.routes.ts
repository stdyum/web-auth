import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: 'login', loadComponent: () => import('./components/login/login.component').then(c => c.LoginComponent) },
  { path: 'signup', loadComponent: () => import('./components/signup/signup.component').then(c => c.SignupComponent) },
  { path: 'apply', loadComponent: () => import('./components/apply/apply.component').then(c => c.ApplyComponent) },
  { path: 'callback', loadComponent: () => import('./components/callback/callback.component').then(c => c.CallbackComponent) },
  { path: '**', redirectTo: 'login' },
];
