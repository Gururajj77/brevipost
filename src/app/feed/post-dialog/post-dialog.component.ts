import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'post-dialog',
  standalone: true,
  imports: [],
  templateUrl: './post-dialog.component.html',
  styleUrl: './post-dialog.component.scss'
})
export class PostDialogComponent {

  @Input() isDialogOpen: boolean = false;
  @Output() closeWrite = new EventEmitter<boolean>();
  openDialog(): void {
    this.isDialogOpen = true;
  }

  closeDialog(): void {
    this.isDialogOpen = false;
    this.closeWrite.emit(true);
  }

  savePost(): void {
    this.closeDialog();
  }

}
