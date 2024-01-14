import { Routes } from '@angular/router';
import { SignInComponent } from './sign-in/sign-in.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { FeedComponent } from './feed/feed.component';
import { authGuard } from './shared/services/guard/auth.guard';
import { MainLayoutComponent } from './shared/components/main-layout/main-layout.component';
import { UsersComponent } from './users/users.component';
import { ProfileComponent } from './profile/profile.component';
import { FollowersComponent } from './profile/followers/followers.component';
import { FollowingComponent } from './profile/following/following.component';
import { ProfilePostsComponent } from './profile/profile-posts/profile-posts.component';

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
            {
                path: 'profile', component: ProfileComponent, canActivate: [authGuard], children: [
                    { path: '', redirectTo: 'posts', pathMatch: 'full' },
                    { path: 'posts', component: ProfilePostsComponent },
                    { path: 'followers', component: FollowersComponent },
                    { path: 'following', component: FollowingComponent }
                ]
            }
        ]
    },
    { path: '**', redirectTo: '/sign-in' }
];
