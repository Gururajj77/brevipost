import { Component, inject } from '@angular/core';
import { Auth, GoogleAuthProvider, signInWithEmailAndPassword, signInWithPopup } from '@angular/fire/auth';
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
    let [_email, _password] = ["gururajtakeshi@gmail.com", "F0rever$"]
    signInWithEmailAndPassword(this.auth, _email, _password)
      .then(userCredential => {
        const user = userCredential.user;
        console.log(userCredential)
      })
      .catch(error => {
        const errorCode = error.code;
        const errorMessage = error.message;
      });
  }

  signInWithGoogle() {
    const provider = new GoogleAuthProvider();
    signInWithPopup(this.auth, provider)
      .then((result) => {
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential?.accessToken;
        const user = result.user;
      }).catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        const email = error.email;
        const credential = GoogleAuthProvider.credentialFromError(error);
      });
  }

  signUpPage() {
    this.router.navigateByUrl('register-user');
  }
}
