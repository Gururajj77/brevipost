import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FirestoreService } from '../shared/services/firestore/firestore.service';
import { Observable, of } from 'rxjs';
import { User } from '../shared/types/User';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss'
})
export class UsersComponent {

  private readonly firestore: FirestoreService = inject(FirestoreService);

  users$: Observable<User[]> = of([]);

  ngOnInit() {
    this.getUsersList()
  }


  getUsersList() {
    this.users$ = this.firestore.getUsers();
  }


  handleImageError(event: any) {
    event.target.src = 'https://via.placeholder.com/150';
  }

  followUser(uid: string) {
    console.log("Follow user with uid: ${uid}");
  }
}
