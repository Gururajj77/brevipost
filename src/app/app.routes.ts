import { Routes } from '@angular/router';
import { SignInComponent } from './sign-in/sign-in.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { FeedComponent } from './feed/feed.component';
import { authGuard } from './shared/services/guard/auth.guard';
import { MainLayoutComponent } from './shared/components/main-layout/main-layout.component';
import { UsersComponent } from './users/users.component';
import { ProfileComponent } from './profile/profile.component';

export const routes: Routes = [
    { path: '', redirectTo: '/sign-in', pathMatch: 'full' },
    { path: 'sign-in', component: SignInComponent },
    { path: 'register-user', component: SignUpComponent },
    {
        path: 'app',
        component: MainLayoutComponent,
        children: [
            { path: 'feed', component: FeedComponent, canActivate: [authGuard] },
            { path: 'users', component: UsersComponent, canActivate: [authGuard] },
            { path: 'profile', component: ProfileComponent, canActivate: [authGuard] }
        ]
    },
    { path: '**', redirectTo: '/sign-in' }
];
