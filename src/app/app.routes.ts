import { Routes } from '@angular/router';
import { Dashboard } from './pages/dashboard/dashboard';
import { Home } from './pages/home/home';
import { Login } from './pages/login/login';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
    {path:"", redirectTo:"login", pathMatch:"full"},
    {path:"login", component:Login},
    {path:"home", component:Home, canActivate: [authGuard]},
    {path:"dashboard", component:Dashboard, canActivate: [authGuard]},
];
