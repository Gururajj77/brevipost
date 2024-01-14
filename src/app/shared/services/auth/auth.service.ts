import { Injectable, inject } from '@angular/core';
import { Auth, GoogleAuthProvider, User, signInWithPopup } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { SnackbarService } from '../../components/snackbar/snackbar.service';
import { Firestore, doc, getDoc } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly auth: Auth = inject(Auth);
  private readonly router: Router = inject(Router);
  private readonly snackbarService: SnackbarService = inject(SnackbarService);
  private readonly firestore: Firestore = inject(Firestore);

  async signInWithGoogle() {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(this.auth, provider);
      this.snackbarService.show('Logged In Successfully');
      this.router.navigateByUrl('/app/feed');
    } catch (error) {
      this.snackbarService.show('Error in Logging in to the App');
    }
  }

  isAuthenticated$(): Observable<boolean> {
    return of(this.auth.currentUser !== null);
  }


  async getCurrentUserDetails(): Promise<User | null> {
    if (this.auth.currentUser) {
      const userId = this.auth.currentUser.uid;
      const userRef = doc(this.firestore, `users/${userId}`);
      const docSnapshot = await getDoc(userRef);

      if (docSnapshot.exists()) {
        return docSnapshot.data() as User;
      } else {
        return null;
      }
    }
    return null;
  }
}
