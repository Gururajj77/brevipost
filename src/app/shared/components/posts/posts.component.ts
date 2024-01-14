import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Post } from '../../types/Post';

@Component({
  selector: 'Posts',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './posts.component.html',
  styleUrl: './posts.component.scss'
})
export class PostsComponent {

  @Input() post: Post = {
    uid: "",
    authorName: "",
    authorProfilePicture: "",
    content: '',
    timestamp: "",
  }


  handleImageError(event: Event) {
    (event.target as HTMLImageElement).style.display = 'none';
  }

}
