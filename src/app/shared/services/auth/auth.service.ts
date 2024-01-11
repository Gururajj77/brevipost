import { Injectable, inject } from '@angular/core';
import { Auth, GoogleAuthProvider, signInWithPopup } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { SnackbarService } from '../../components/snackbar/snackbar.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly auth: Auth = inject(Auth);
  private readonly router: Router = inject(Router);
  private readonly snackbarService: SnackbarService = inject(SnackbarService);
  signInWithGoogle() {
    const provider = new GoogleAuthProvider();
    signInWithPopup(this.auth, provider)
      .then((result) => {
        this.snackbarService.show('Logged In Successfully');
        this.router.navigateByUrl('/feed')
      }).catch((error) => {
        this.snackbarService.show('Error in Logging in to the App');
      });
  }

  isAuthenticated$(): Observable<boolean> {
    return of(this.auth.currentUser !== null);
  }
}
