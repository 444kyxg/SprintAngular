import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login';
import { HomeComponent } from './pages/home/home';
import { DashboardComponent } from './pages/dashboard/dashboard';
import { authGuard } from './guard/auth-guard';

export const routes: Routes = [
    {path:"login",component:LoginComponent},
    {path:"home",component:HomeComponent, canActivate:[authGuard]},
    {path:"dashboard",component:DashboardComponent, canActivate:[authGuard] },
    {path:"", redirectTo:"login", pathMatch:"full"}
]