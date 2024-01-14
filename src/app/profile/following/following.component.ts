import { Component, inject } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { Observable, of } from 'rxjs';
import { UserRelationService } from '../../shared/services/firestore/user-relation.service';
import { User } from '../../shared/types/User';

@Component({
  selector: 'app-following',
  standalone: true,
  imports: [],
  templateUrl: './following.component.html',
  styleUrl: './following.component.scss'
})
export class FollowingComponent {

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
      this.usersWithFollowStatus$ = this.userRelations.getUsersWithFollowingStatus(this.auth.currentUser.uid)
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
