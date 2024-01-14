import { Injectable, inject } from '@angular/core';
import { DocumentData, Firestore, addDoc, collection, collectionData, deleteDoc, doc, docData, getDocs, increment, orderBy, query, setDoc, updateDoc, where } from '@angular/fire/firestore';
import { Post } from '../../types/Post';
import { Observable, map, switchMap } from 'rxjs';
import { User } from '../../types/User';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class FirestoreService {

  private readonly firestore: Firestore = inject(Firestore);

  addUserDetails(userId: string, userDetails: any): Promise<void> {
    const userDocRef = doc(this.firestore, `users/${userId}`);
    return setDoc(userDocRef, userDetails);
  }

  async addPost(postData: Post, userId: string): Promise<void> {
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

  getUsers(): Observable<User[]> {
    const usersRef = collection(this.firestore, 'users');
    return collectionData(usersRef, { idField: 'uid' }) as Observable<User[]>;
  }
}
