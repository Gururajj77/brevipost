import { Component, inject } from '@angular/core';
import { Auth, GoogleAuthProvider, createUserWithEmailAndPassword, signInWithPopup, updateProfile } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-sign-up',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.scss'
})
export class SignUpComponent {

  registerForm!: FormGroup;

  private readonly auth: Auth = inject(Auth);
  private readonly router: Router = inject(Router);
  private readonly formBuilder: FormBuilder = inject(FormBuilder);

  constructor() {
    this.registerForm = this.formBuilder.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required,
      Validators.minLength(8),
      Validators.pattern('^(?=.*[A-Z])(?=.*[!@#$&*]).{8,}$')]]
    });
  }


  register() {
    if (this.registerForm.valid) {
      const { name, email, password } = this.registerForm.value;
      createUserWithEmailAndPassword(this.auth, email, password)
        .then(userCredential => {
          return updateProfile(userCredential.user, { displayName: name });
        })
        .then(() => {
          this.router.navigateByUrl('/feed');
        })
        .catch(error => {
          console.error('Registration error:', error);
        });
    }
  }

  signInWithGoogle() {
    const provider = new GoogleAuthProvider();
    signInWithPopup(this.auth, provider)
      .then((result) => {
        const credential = GoogleAuthProvider.credentialFromResult(result);
        this.router.navigateByUrl('/feed');
      }).catch((error) => {
        const credential = GoogleAuthProvider.credentialFromError(error);
      });
  }
  toLoginPage() {
    this.router.navigateByUrl('sign-in')
  }

}
