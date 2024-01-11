import { Injectable, inject } from '@angular/core';
import { Auth, GoogleAuthProvider, signInWithPopup } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly auth: Auth = inject(Auth);
  private readonly router: Router = inject(Router);

  signInWithGoogle() {
    const provider = new GoogleAuthProvider();
    signInWithPopup(this.auth, provider)
      .then((result) => {
        const credential = GoogleAuthProvider.credentialFromResult(result);
        this.router.navigateByUrl('/feed')
      }).catch((error) => {
        const credential = GoogleAuthProvider.credentialFromError(error);
      });
  }

  isAuthenticated$(): Observable<boolean> {
    return of(this.auth.currentUser !== null);
  }
}
