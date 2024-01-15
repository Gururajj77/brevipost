import { Auth, onAuthStateChanged } from '@angular/fire/auth';
import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FirestoreService } from '../shared/services/firestore/firestore.service';
import { Observable, of } from 'rxjs';
import { User } from '../shared/types/User';
import { UserRelationService } from '../shared/services/firestore/user-relation.service';
import { OtherUserComponent } from '../shared/components/other-user/other-user.component';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, OtherUserComponent],
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss'
})
export class UsersComponent {

  private readonly firestore: FirestoreService = inject(FirestoreService);
  private readonly auth: Auth = inject(Auth);
  private readonly userRelations: UserRelationService = inject(UserRelationService);

  uid: string | undefined = "";
  users$: Observable<User[]> = of([]);
  followingUids$: Observable<string[]> = of([]);
  usersWithFollowStatus$: Observable<any[]> = of([]);


  ngOnInit() {
    this.getUsersList();
    this.checkFollowStatus();
    this.uid = this.auth.currentUser?.uid;
  }

  checkFollowStatus() {
    if (this.auth.currentUser) {
      this.usersWithFollowStatus$ = this.userRelations.getUsersWithFollowingStatus(this.auth.currentUser.uid)
    }
  }

  getUsersList() {
    this.users$ = this.firestore.getUsers();
  }


  handleImageError(event: any) {
    (event.target as HTMLImageElement).style.display = 'none';
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
