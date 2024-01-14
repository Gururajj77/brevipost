import { Component, inject } from '@angular/core';
import { Auth, sendPasswordResetEmail, signInWithEmailAndPassword, signInWithPopup } from '@angular/fire/auth';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../shared/services/auth/auth.service';
import { LoaderComponent } from '../shared/components/loader/loader.component';
import { SnackbarService } from '../shared/components/snackbar/snackbar.service';

@Component({
  selector: 'app-sign-in',
  standalone: true,
  imports: [ReactiveFormsModule, LoaderComponent],
  templateUrl: './sign-in.component.html',
  styleUrl: './sign-in.component.scss'
})
export class SignInComponent {

  loginForm!: FormGroup;
  isLoading: boolean = true;

  private readonly auth: Auth = inject(Auth);
  private readonly router: Router = inject(Router);
  private readonly formBuilder: FormBuilder = inject(FormBuilder);

  private readonly authService: AuthService = inject(AuthService);
  private readonly snackbarService: SnackbarService = inject(SnackbarService);



  ERROR_CODE: string = "";
  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required,
      Validators.minLength(8),
      Validators.pattern('^(?=.*[A-Z])(?=.*[!@#$&*]).{8,}$')]]
    });
    this.persistLoggedInUser();
  }


  async signIn() {
    if (this.loginForm.valid) {
      try {
        const { email, password } = this.loginForm.value;
        await signInWithEmailAndPassword(this.auth, email, password);
        this.snackbarService.show('Signed In Successfully', 5000);
        this.router.navigateByUrl('app/feed');
      } catch (error: any) {
        this.ERROR_CODE = error.code;
        console.log(this.ERROR_CODE);
        this.snackbarService.show('Error Signing In');
      }
    }
  }


  persistLoggedInUser() {
    this.auth.onAuthStateChanged((user) => {
      this.isLoading = false;
      if (user) {
        this.router.navigateByUrl('app/feed');
      } else {
        this.auth.signOut();
      }
    });
  }

  signInWithGoogle() {
    this.authService.signInWithGoogle();
  }

  signUpPage() {
    this.router.navigateByUrl('/register-user');
  }

  async resetPassword() {
    if (this.loginForm && this.loginForm.get('email') && this.loginForm.get('password')) {
      try {
        const email = this.loginForm.get('email')!.value;
        await sendPasswordResetEmail(this.auth, email);
        this.snackbarService.show('Password reset email sent', 5000);
      } catch (error) {
        this.snackbarService.show('Error sending password reset email', 2500);
      }
    }
  }
}
