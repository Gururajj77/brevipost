import { Injectable, inject } from '@angular/core';
import { Auth, GoogleAuthProvider, User, signInWithPopup } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { SnackbarService } from '../../components/snackbar/snackbar.service';
import { Firestore } from '@angular/fire/firestore';

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


  getCurrentUserDetails() {
    if (this.auth.currentUser) {
      const user = this.auth.currentUser;
      return {
        uid: user.uid,
        email: user.email,
        photoUrl: user.photoURL,
        name: user.displayName,
      }
    }
    return null;
  }
}
