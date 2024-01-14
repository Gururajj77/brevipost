import { Component, inject } from '@angular/core';
import { Auth, GoogleAuthProvider, createUserWithEmailAndPassword, signInWithPopup, updateProfile } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FirestoreService } from '../shared/services/firestore/firestore.service';
import { SnackbarService } from '../shared/components/snackbar/snackbar.service';

type UserData = {
  uid: string;
  name: string | null;
  email: string | null;
  photoUrl: string | null
}

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


  async register() {
    if (this.registerForm.valid) {
      try {
        const { name, email, password } = this.registerForm.value;
        const userCredential = await createUserWithEmailAndPassword(this.auth, email, password);

        const uid = userCredential.user.uid;
        const photoUrl = userCredential.user.photoURL;

        const userDetails: UserData = {
          uid,
          name,
          email,
          photoUrl
        };

        await this.firestoreService.addUserDetails(uid, userDetails);
        this.snackbarService.show('User details added to Firestore');

        await updateProfile(userCredential.user, { displayName: name });

        this.router.navigateByUrl('app/feed');
      } catch (error) {
        this.snackbarService.show('Error during registration.');
      }
    }
  }


  async signInWithGoogle() {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(this.auth, provider);

      const uid = result.user.uid;
      const email = result.user.email;
      const name = result.user.displayName;
      const photoUrl = result.user.photoURL;

      const userDetails: UserData = { uid, name, email, photoUrl };

      await this.firestoreService.addUserDetails(uid, userDetails);
      this.snackbarService.show('User details added to Firestore');

      this.router.navigateByUrl('app/feed');
    } catch (error) {
      this.snackbarService.show('Error in Registering new User');
    }
  }


  toLoginPage() {
    this.router.navigateByUrl('sign-in');
  }

}
