import { Component, inject } from '@angular/core';
import { Auth, GoogleAuthProvider, sendPasswordResetEmail, signInWithEmailAndPassword, signInWithPopup } from '@angular/fire/auth';
import { Form, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-sign-in',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './sign-in.component.html',
  styleUrl: './sign-in.component.scss'
})
export class SignInComponent {

  loginForm!: FormGroup;

  private readonly auth: Auth = inject(Auth);
  private readonly router: Router = inject(Router);
  private readonly formBuilder: FormBuilder = inject(FormBuilder);

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required,
      Validators.minLength(8),
      Validators.pattern('^(?=.*[A-Z])(?=.*[!@#$&*]).{8,}$')]]
    });
  }


  signIn() {
    if (this.loginForm && this.loginForm.get('email') && this.loginForm.get('password')) {
      const email = this.loginForm.get('email')!.value;
      const password = this.loginForm.get('password')!.value;
      signInWithEmailAndPassword(this.auth, email, password)
        .then(userCredential => {
          const user = userCredential.user;
          console.log(userCredential)
        })
        .catch(error => {
          const errorCode = error.code;
          const errorMessage = error.message;
        });
    }

  }

  signInWithGoogle() {
    const provider = new GoogleAuthProvider();
    signInWithPopup(this.auth, provider)
      .then((result) => {
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential?.accessToken;
        const user = result.user;
      }).catch((error) => {
        const credential = GoogleAuthProvider.credentialFromError(error);
      });
  }

  signUpPage() {
    this.router.navigateByUrl('register-user');
  }

  resetPassword() {
    if (this.loginForm && this.loginForm.get('email') && this.loginForm.get('password')) {
      const email = this.loginForm.get('email')!.value;
      sendPasswordResetEmail(this.auth, email)
        .then(() => {
          console.log('Password reset email sent');
        })
        .catch((error) => {
          console.error('Error sending password reset email: ', error);
        });
    }
  }
}
