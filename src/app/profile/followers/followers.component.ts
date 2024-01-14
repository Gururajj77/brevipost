import { Component, inject } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { UserRelationService } from '../../shared/services/firestore/user-relation.service';
import { Observable, of } from 'rxjs';
import { CommonModule } from '@angular/common';
import { OtherUserComponent } from '../../shared/components/other-user/other-user.component';
import { User } from '../../shared/types/User';

@Component({
  selector: 'app-followers',
  standalone: true,
  imports: [CommonModule, OtherUserComponent],
  templateUrl: './followers.component.html',
  styleUrl: './followers.component.scss'
})
export class FollowersComponent {

  private readonly auth: Auth = inject(Auth);
  private readonly userRelations: UserRelationService = inject(UserRelationService);
  usersWithFollowStatus$: Observable<any[]> = of([]);
  uid: string | undefined;

  ngOnInit() {
    this.checkFollowStatus();
    this.uid = this.auth.currentUser?.uid;
  }

  checkFollowStatus() {
    if (this.auth.currentUser) {
      this.usersWithFollowStatus$ = this.userRelations.getFollowersList(this.auth.currentUser.uid)
    }
  }

  followUser(followingUser: User) {
    if (this.auth.currentUser) {
      this.userRelations.followUser(this.auth.currentUser.uid, followingUser);
    }
  }

  unfollowUser(followingUserId: string) {
    if (this.auth.currentUser) {
      this.userRelations.unfollowUser(this.auth.currentUser.uid, followingUserId);
    }
  }
}
