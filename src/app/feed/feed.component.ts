import { Component, inject } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { CustomButtonComponent } from '../shared/components/custom-button/custom-button.component';
import { SnackbarService } from '../shared/components/snackbar/snackbar.service';
import { PostDialogComponent } from './post-dialog/post-dialog.component';
import { Observable, of } from 'rxjs';
import { Post } from '../shared/types/Post';
import { FirestoreService } from '../shared/services/firestore/firestore.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-feed',
  standalone: true,
  imports: [CustomButtonComponent, PostDialogComponent, CommonModule],
  templateUrl: './feed.component.html',
  styleUrl: './feed.component.scss'
})
export class FeedComponent {

  private readonly auth: Auth = inject(Auth);
  private readonly firestore: FirestoreService = inject(FirestoreService)
  openDialogBox: boolean = false;
  posts$: Observable<Post[]> = of([]);

  ngOnInit() {
    this.refreshPosts();
  }

  toggleWrite() {
    this.openDialogBox = !this.openDialogBox;
    this.refreshPosts();
  }

  handleImageError(event: Event) {
    (event.target as HTMLImageElement).style.display = 'none';
  }

  refreshPosts() {
    this.posts$ = this.firestore.getPosts();
  }

}
