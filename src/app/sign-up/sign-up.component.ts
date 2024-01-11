import { Component, inject } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, updateProfile } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../shared/services/auth/auth.service';
import { CustomButtonComponent } from '../shared/components/custom-button/custom-button.component';
import { FirestoreService } from '../shared/services/firestore/firestore.service';

@Component({
  selector: 'app-sign-up',
  standalone: true,
  imports: [ReactiveFormsModule, CustomButtonComponent],
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.scss'
})
export class SignUpComponent {

  registerForm!: FormGroup;

  private readonly auth: Auth = inject(Auth);
  private readonly router: Router = inject(Router);
  private readonly formBuilder: FormBuilder = inject(FormBuilder);

  private readonly authService: AuthService = inject(AuthService);
  private firestoreService: FirestoreService = inject(FirestoreService);
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
          const uid = userCredential.user.uid;
          const userDetails = {
            uid,
            name,
            email,
          };
          this.firestoreService.addUserDetails(uid, userDetails)
            .then(() => {
              console.log('User details added to Firestore');
            })
            .catch((error) => {
              console.error('Error adding user details to Firestore', error);
            });
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
    this.authService.signInWithGoogle();
  }

  toLoginPage() {
    this.router.navigateByUrl('sign-in')
  }

}
