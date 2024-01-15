import { Injectable, inject } from '@angular/core';
import { DocumentData, Firestore, collection, collectionData, deleteDoc, doc, docData, increment, query, setDoc, updateDoc, where } from '@angular/fire/firestore';
import { AuthService } from '../auth/auth.service';
import { User } from '@angular/fire/auth';
import { Observable, combineLatest, from, map, switchMap } from 'rxjs';
import { Post } from '../../types/Post';
import { FirestoreService } from './firestore.service';

@Injectable({
  providedIn: 'root'
})
export class UserRelationService {

  private readonly firestore: Firestore = inject(Firestore);
  private readonly auth: AuthService = inject(AuthService);
  private readonly firestoreService: FirestoreService = inject(FirestoreService);



  async followUser(loggedInUserId: string, userToFollowId: string): Promise<void> {
    const followingRef = doc(this.firestore, `users/${loggedInUserId}/following`, userToFollowId);
    await setDoc(followingRef, { uid: userToFollowId });

    const followersRef = doc(this.firestore, `users/${userToFollowId}/followers`, loggedInUserId);
    await setDoc(followersRef, { uid: loggedInUserId });

    const userToFollowRef = doc(this.firestore, `users/${userToFollowId}`);
    await updateDoc(userToFollowRef, {
      followerCount: increment(1)
    });

    const loggedInUserRef = doc(this.firestore, `users/${loggedInUserId}`);
    await updateDoc(loggedInUserRef, {
      followingCount: increment(1)
    });
  }

  async unfollowUser(loggedInUserId: string, userToUnfollowId: string): Promise<void> {
    await deleteDoc(doc(this.firestore, `users/${loggedInUserId}/following`, userToUnfollowId));

    await deleteDoc(doc(this.firestore, `users/${userToUnfollowId}/followers`, loggedInUserId));

    const userToUnfollowRef = doc(this.firestore, `users/${userToUnfollowId}`);
    await updateDoc(userToUnfollowRef, {
      followerCount: increment(-1)
    });

    const loggedInUserRef = doc(this.firestore, `users/${loggedInUserId}`);
    await updateDoc(loggedInUserRef, {
      followingCount: increment(-1)
    });
  }

  getFollowingUids(loggedInUserId: string): Observable<string[]> {
    const followingRef = collection(this.firestore, `users/${loggedInUserId}/following`);
    return collectionData(followingRef).pipe(
      map(followingDocs => followingDocs.map(doc => doc['uid']))
    );
  }

  getFollowerUids(loggedInUserId: string): Observable<string[]> {
    const followingRef = collection(this.firestore, `users/${loggedInUserId}/following`);
    return collectionData(followingRef).pipe(
      map(followingDocs => followingDocs.map(doc => doc['uid']))
    );
  }



  getUserById(userId: string): Observable<DocumentData | User | undefined> {
    const userRef = doc(this.firestore, `users/${userId}`);
    return docData(userRef);
  }

  getPostsFromFollowing(currentUserId: string): Observable<Post[]> {
    return this.getFollowingUids(currentUserId).pipe(
      switchMap(followingUserIds => {
        const postsRef = collection(this.firestore, 'posts');
        const postsQuery = query(postsRef, where('uid', 'in', followingUserIds));
        return collectionData(postsQuery) as Observable<Post[]>;
      })
    );
  }

  getUsersWithFollowingStatus(uid: string) {
    const followingUids$ = this.getFollowingUids(uid);
    const users$ = this.firestoreService.getUsers();

    return combineLatest([users$, followingUids$]).pipe(
      map(([users, followingUids]) =>
        users.map(user => ({
          ...user,
          isFollowing: followingUids.includes(user.uid)
        }))
      )
    );
  }

  getFollowersList(loggedInUserId: string): Observable<User[]> {
    const followersRef = collection(this.firestore, `users/${loggedInUserId}/followers`);
    return collectionData(followersRef, { idField: 'uid' }).pipe(
      switchMap(followers => {
        const userDocs = followers.map(follower => doc(this.firestore, `users/${follower.uid}`));
        return userDocs.length ? combineLatest(userDocs.map(userDoc => docData(userDoc))) : from([[]]);
      })
    ) as Observable<User[]>;
  }

  getFollowers(uid: string) {
    const followerUids$ = this.getFollowerUids(uid);
    const users$ = this.getFollowersList(uid);

    return combineLatest([users$, followerUids$]).pipe(
      map(([users, followerUids]) =>
        users.map(user => ({
          ...user,
          isFollowing: followerUids.includes(user.uid)
        }))
      )
    );
  }

  getFollowingList(loggedInUserId: string): Observable<User[]> {
    const followingRef = collection(this.firestore, `users/${loggedInUserId}/following`);
    return collectionData(followingRef, { idField: 'uid' }).pipe(
      switchMap(following => {
        const userDocs = following.map(followedUser => doc(this.firestore, `users/${followedUser.uid}`));
        return userDocs.length ? combineLatest(userDocs.map(userDoc => docData(userDoc))) : from([[]]);
      })
    ) as Observable<User[]>;
  }

  getFollowing(uid: string) {
    const followingUids$ = this.getFollowingUids(uid);
    const users$ = this.getFollowingList(uid);

    return combineLatest([users$, followingUids$]).pipe(
      map(([users, followingUids]) =>
        users.map(user => ({
          ...user,
          isFollowing: followingUids.includes(user.uid)
        }))
      )
    );
  }

}
