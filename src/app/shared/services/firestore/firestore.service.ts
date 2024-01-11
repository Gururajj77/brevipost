import { Injectable, inject } from '@angular/core';
import { Firestore, doc, setDoc } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class FirestoreService {

  private readonly firestore: Firestore = inject(Firestore);

  addUserDetails(userId: string, userDetails: any) {
    const userDocRef = doc(this.firestore, `users/${userId}`);
    return setDoc(userDocRef, userDetails);
  }
}
