import { Component, inject } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { FirestoreService } from '../shared/services/firestore/firestore.service';
import { Observable, of } from 'rxjs';
import { CommonModule } from '@angular/common';
import { User } from '../shared/types/User';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent {

  private readonly auth: Auth = inject(Auth);
  private readonly firestore: FirestoreService = inject(FirestoreService);
  userDetails: any = {};
  ngOnInit() {
    if (this.auth.currentUser) {

      this.firestore.getUserById(this.auth.currentUser.uid).subscribe((data) => this.userDetails = data);
    }
  }

}
