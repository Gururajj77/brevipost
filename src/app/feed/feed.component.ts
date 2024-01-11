import { Component, inject } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { CustomButtonComponent } from '../shared/components/custom-button/custom-button.component';
import { SnackbarService } from '../shared/components/snackbar/snackbar.service';
import { PostDialogComponent } from './post-dialog/post-dialog.component';

@Component({
  selector: 'app-feed',
  standalone: true,
  imports: [CustomButtonComponent, PostDialogComponent],
  templateUrl: './feed.component.html',
  styleUrl: './feed.component.scss'
})
export class FeedComponent {

  private readonly auth: Auth = inject(Auth);
  openDialogBox: boolean = false
  openWrite() {
    this.openDialogBox = !this.openDialogBox;
  }



}
