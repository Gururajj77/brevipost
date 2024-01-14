import { Component, EventEmitter, Input, Output } from '@angular/core';
import { User } from '../../types/User';

@Component({
  selector: 'OtherUser',
  standalone: true,
  imports: [],
  templateUrl: './other-user.component.html',
  styleUrl: './other-user.component.scss'
})
export class OtherUserComponent {

  @Input() currentUserId?: string = "";
  @Input() user!: any;
  @Output() follow = new EventEmitter<User>();
  @Output() unfollow = new EventEmitter<string>();

  handleImageError(event: any) {
    (event.target as HTMLImageElement).style.display = 'none';
  }
  followUser(): void {
    this.follow.emit(this.user);
  }

  unfollowUser(): void {
    this.unfollow.emit(this.user.uid);
  }
}
