import { Component, inject } from '@angular/core';
import { Auth, GoogleAuthProvider, createUserWithEmailAndPassword, signInWithPopup, updateProfile } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CustomButtonComponent } from '../shared/components/custom-button/custom-button.component';
import { FirestoreService } from '../shared/services/firestore/firestore.service';
import { SnackbarService } from '../shared/components/snackbar/snackbar.service';

type UserData = {
  uid: string;
  name: string | null;
  email: string | null;
}

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
  private readonly snackbarService: SnackbarService = inject(SnackbarService);

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
          const userDetails: UserData = {
            uid,
            name,
            email,
          };
          this.firestoreService.addUserDetails(uid, userDetails)
            .then(() => {
              this.snackbarService.show('User details added to Firestore');
            })
            .catch((error) => {
              this.snackbarService.show('Error adding user details to Firestore');
            });
          return updateProfile(userCredential.user, { displayName: name });
        })
        .then(() => {
          this.router.navigateByUrl('app/feed');
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
        const uid = result.user.uid;
        const email = result.user.email;
        const name = result.user.displayName;
        const userDetails: UserData = {
          uid,
          name,
          email,
        };
        this.firestoreService.addUserDetails(uid, userDetails)
          .then(() => {
            this.snackbarService.show('User details added to Firestore');
          })
          .catch((error) => {
            this.snackbarService.show('Error adding user details to Firestore');
          });
        this.router.navigateByUrl('app/feed')
      }).catch((error) => {
        this.snackbarService.show('Error in Registering new User');
      });
  }

  toLoginPage() {
    this.router.navigateByUrl('sign-in');
  }

}
