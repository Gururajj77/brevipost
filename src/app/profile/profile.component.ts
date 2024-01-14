import { Component, inject } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { UserRelationService } from '../shared/services/firestore/user-relation.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent {

  private readonly auth: Auth = inject(Auth);
  private readonly userRelations: UserRelationService = inject(UserRelationService);
  userDetails: any = {};
  ngOnInit() {
    if (this.auth.currentUser) {
      this.userRelations.getUserById(this.auth.currentUser.uid).subscribe((data) => this.userDetails = data);
    }
  }

  handleImageError(event: any) {
    (event.target as HTMLImageElement).style.display = 'none';
  }

}
