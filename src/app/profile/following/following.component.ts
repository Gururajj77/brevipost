import { Component, inject } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { Observable, of } from 'rxjs';
import { UserRelationService } from '../../shared/services/firestore/user-relation.service';
import { OtherUserComponent } from '../../shared/components/other-user/other-user.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-following',
  standalone: true,
  imports: [OtherUserComponent, CommonModule],
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
      this.usersWithFollowStatus$ = this.userRelations.getFollowing(this.auth.currentUser.uid)
    }
  }

  followUser(followingUserId: string) {
    if (this.auth.currentUser) {
      this.userRelations.followUser(this.auth.currentUser.uid, followingUserId);
    }
  }

  unfollowUser(followingUserId: string) {
    if (this.auth.currentUser) {
      this.userRelations.unfollowUser(this.auth.currentUser.uid, followingUserId);
    }
  }

}
