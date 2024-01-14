import { Injectable, inject } from '@angular/core';
import { DocumentData, Firestore, addDoc, collection, collectionData, deleteDoc, doc, docData, increment, orderBy, query, setDoc, updateDoc, where } from '@angular/fire/firestore';
import { Post } from '../../types/Post';
import { Observable, map } from 'rxjs';
import { User } from '../../types/User';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class FirestoreService {

  private readonly firestore: Firestore = inject(Firestore);
  private readonly auth: AuthService = inject(AuthService);

  addUserDetails(userId: string, userDetails: any) {
    const userDocRef = doc(this.firestore, `users/${userId}`);
    return setDoc(userDocRef, userDetails);
  }

  async addPost(postData: Post, userId: string) {
    const postsCollectionRef = collection(this.firestore, 'posts');
    await addDoc(postsCollectionRef, postData);

    const userRef = doc(this.firestore, `users/${userId}`);
    await updateDoc(userRef, {
      postsCount: increment(1)
    });
  }

  getPosts(): Observable<Post[]> {
    const postsRef = collection(this.firestore, 'posts');
    const orderedPostsQuery = query(postsRef, orderBy('timestamp', 'desc'));
    return collectionData(orderedPostsQuery, { idField: 'id' }) as Observable<Post[]>;
  }

  getUsers() {
    const usersRef = collection(this.firestore, 'users');
    return collectionData(usersRef, { idField: 'uid' }) as Observable<User[]>;
  }

  async followUser(loggedInUserId: string, userToFollow: any): Promise<void> {
    await setDoc(doc(this.firestore, `users/${loggedInUserId}/following`, userToFollow.uid), userToFollow);

    const followerData = this.auth.getCurrentUserDetails();

    await setDoc(doc(this.firestore, `users/${userToFollow.uid}/followers`, loggedInUserId), followerData);

    const userToFollowRef = doc(this.firestore, `users/${userToFollow.uid}`);
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

  getFollowingPosts(userUids: string[]): Observable<Post[]> {
    const postsRef = collection(this.firestore, 'posts');

    let postsQuery = query(postsRef, orderBy('timestamp', 'desc'));
    if (userUids.length > 0) {
      postsQuery = query(postsRef, where('uid', 'in', userUids), orderBy('timestamp', 'desc'));
    }
    return collectionData(postsQuery, { idField: 'id' }) as Observable<Post[]>;
  }

  getUserById(userId: string): Observable<DocumentData | User | undefined> {
    const userRef = doc(this.firestore, `users/${userId}`);
    return docData(userRef);
  }
}
