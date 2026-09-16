import { Routes } from '@angular/router';
import { Dashboard } from './pages/dashboard/dashboard';
import { Home } from './pages/home/home';
import { Login } from './pages/login/login';

export const routes: Routes = [
    {path:"", redirectTo:"login", pathMatch:"full"},
    {path:"login", component:Login},
    {path:"home", component:Home},
    {path:"dashboard", component:Dashboard},
];
