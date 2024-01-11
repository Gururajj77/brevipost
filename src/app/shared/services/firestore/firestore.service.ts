import { Injectable, inject } from '@angular/core';
import { Firestore, addDoc, collection, collectionData, doc, orderBy, query, serverTimestamp, setDoc } from '@angular/fire/firestore';
import { Post } from '../../types/Post';
import { Observable } from 'rxjs';

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
}
