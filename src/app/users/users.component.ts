import { Auth, onAuthStateChanged } from '@angular/fire/auth';
import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FirestoreService } from '../shared/services/firestore/firestore.service';
import { Observable, combineLatest, map, of } from 'rxjs';
import { User } from '../shared/types/User';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss'
})
export class UsersComponent {

  private readonly firestore: FirestoreService = inject(FirestoreService);
  private readonly auth: Auth = inject(Auth);
  uid: string | undefined = "";
  users$: Observable<User[]> = of([]);
  followingUids$: Observable<string[]> = of([]);
  usersWithFollowStatus$: Observable<any[]> = of([]);


  ngOnInit() {
    this.getUsersList();
    this.checkFollowStatus();
    this.uid = this.auth.currentUser?.uid
  }

  checkFollowStatus() {
    if (this.auth.currentUser) {
      this.followingUids$ = this.firestore.getFollowingUids(this.auth.currentUser.uid);
      this.usersWithFollowStatus$ = combineLatest([this.users$, this.followingUids$]).pipe(
        map(([users, followingUids]) =>
          users.map(user => ({
            ...user,
            isFollowing: followingUids.includes(user.uid)
          }))
        )
      );
    }
  }


  getUsersList() {
    this.users$ = this.firestore.getUsers();
  }


  handleImageError(event: any) {
    (event.target as HTMLImageElement).style.display = 'none';
  }

  followUser(followingUser: string) {
    if (this.auth.currentUser) {
      this.firestore.followUser(this.auth.currentUser.uid, followingUser);
    }
  }

  unfollowUser(followingUserId: string) {
    if (this.auth.currentUser) {
      this.firestore.unfollowUser(this.auth.currentUser.uid, followingUserId);
    }
  }
}
