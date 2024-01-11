import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { FormsModule } from '@angular/forms';
import { FirestoreService } from '../../shared/services/firestore/firestore.service';
import { Post } from '../../shared/types/Post';
import { serverTimestamp } from '@angular/fire/firestore';



@Component({
  selector: 'post-dialog',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './post-dialog.component.html',
  styleUrl: './post-dialog.component.scss'
})
export class PostDialogComponent {

  private readonly auth: Auth = inject(Auth);
  private readonly firestore: FirestoreService = inject(FirestoreService);

  @Input() isDialogOpen: boolean = false;
  @Output() closeWrite = new EventEmitter<boolean>();

  postContent: string = "";

  openDialog(): void {
    this.isDialogOpen = true;
  }

  closeDialog(): void {
    this.isDialogOpen = false;
    this.closeWrite.emit(true);
  }

  savePost(): void {
    const user = this.auth.currentUser;
    const post: Post = {
      "uid": user?.uid,
      "authorName": user?.displayName,
      "authorProfilePicture": user?.photoURL,
      "content": this.postContent,
      timestamp: serverTimestamp()
    }
    console.log(this.postContent)
    this.firestore.addPost(post);
    this.closeDialog();
  }

}
