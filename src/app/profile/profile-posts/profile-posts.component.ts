import { Component, inject } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { Post } from '../../shared/types/Post';
import { PostsComponent } from '../../shared/components/posts/posts.component';
import { UserRelationService } from '../../shared/services/firestore/user-relation.service';
import { SnackbarService } from '../../shared/components/snackbar/snackbar.service';

@Component({
  selector: 'app-profile-posts',
  standalone: true,
  imports: [PostsComponent],
  templateUrl: './profile-posts.component.html',
  styleUrl: './profile-posts.component.scss'
})
export class ProfilePostsComponent {

  private readonly auth: Auth = inject(Auth);
  private readonly userRelations: UserRelationService = inject(UserRelationService);
  private readonly snack: SnackbarService = inject(SnackbarService)

  posts: Post[] = [];


  ngOnInit() {
    if (this.auth.currentUser) {
      this.userRelations.getPostsFromFollowing(this.auth.currentUser.uid)
        .subscribe({
          next: (posts) => {
            this.posts = posts;
          },
          error: (error) => {
            this.snack.show("No posts from your following users");
          }
        });
    }
  }
}
