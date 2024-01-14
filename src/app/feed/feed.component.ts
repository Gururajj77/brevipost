import { Component, inject } from '@angular/core';
import { PostDialogComponent } from './post-dialog/post-dialog.component';
import { Observable, of } from 'rxjs';
import { Post } from '../shared/types/Post';
import { FirestoreService } from '../shared/services/firestore/firestore.service';
import { CommonModule } from '@angular/common';
import { PostsComponent } from '../shared/components/posts/posts.component';

@Component({
  selector: 'app-feed',
  standalone: true,
  imports: [PostDialogComponent, CommonModule, PostsComponent],
  templateUrl: './feed.component.html',
  styleUrl: './feed.component.scss'
})
export class FeedComponent {


  private readonly firestore: FirestoreService = inject(FirestoreService);
  openDialogBox: boolean = false;
  posts$: Observable<Post[]> = of([]);

  ngOnInit() {
    this.refreshPosts();
  }

  toggleWrite() {
    this.openDialogBox = !this.openDialogBox;
  }

  closeWrite() {
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
