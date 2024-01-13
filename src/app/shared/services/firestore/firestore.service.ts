import { Injectable, inject } from '@angular/core';
import { Firestore, addDoc, collection, collectionData, deleteDoc, doc, docData, increment, orderBy, query, setDoc, updateDoc } from '@angular/fire/firestore';
import { Post } from '../../types/Post';
import { Observable, map } from 'rxjs';
import { User } from '../../types/User';

@Injectable({
  providedIn: 'root'
})
export class FirestoreService {

  private readonly firestore: Firestore = inject(Firestore);

  addUserDetails(userId: string, userDetails: any) {
    const userDocRef = doc(this.firestore, `users/${userId}`);
    return setDoc(userDocRef, userDetails);
  }

  addPost(postData: Post) {
    const postsCollectionRef = collection(this.firestore, 'posts');
    return addDoc(postsCollectionRef, postData);
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

  async followUser(loggedInUserId: string, userToFollowId: string): Promise<void> {
    const followingData = { uid: userToFollowId };
    await setDoc(doc(this.firestore, `users/${loggedInUserId}/following`, userToFollowId), followingData);
    const followerData = { uid: loggedInUserId };
    await setDoc(doc(this.firestore, `users/${userToFollowId}/followers`, loggedInUserId), followerData);
    const userToFollowRef = doc(this.firestore, `users/${userToFollowId}`);
    await updateDoc(userToFollowRef, {
      followerCount: increment(1)
    });
  }

  async unfollowUser(loggedInUserId: string, userToUnfollowId: string): Promise<void> {
    await deleteDoc(doc(this.firestore, `users/${loggedInUserId}/following`, userToUnfollowId));
    await deleteDoc(doc(this.firestore, `users/${userToUnfollowId}/followers`, loggedInUserId));
    const userToUnfollowRef = doc(this.firestore, `users/${userToUnfollowId}`);
    await updateDoc(userToUnfollowRef, {
      followerCount: increment(-1)
    });
  }

  getFollowingUids(loggedInUserId: string): Observable<string[]> {
    const followingRef = collection(this.firestore, `users/${loggedInUserId}/following`);
    return collectionData(followingRef, { idField: 'uid' }).pipe(
      map(followingDocs => followingDocs.map(doc => doc.uid))
    );
  }
}
