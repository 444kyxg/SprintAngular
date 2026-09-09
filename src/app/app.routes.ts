import { Routes } from '@angular/router';
import { Login } from './pages/login/login';
import { DashboardComponent } from './pages/dashboard/dashboard';
import { HomeComponent } from './pages/home/home';

export const routes: Routes = [
  {
    path: 'login',
    component: Login
  },
  {
    path: 'home',
    component: HomeComponent
  },
  {
    path: 'dashboard',
    component: DashboardComponent
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  }
];