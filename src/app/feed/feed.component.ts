import { Component, inject } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { CustomButtonComponent } from '../shared/components/custom-button/custom-button.component';

@Component({
  selector: 'app-feed',
  standalone: true,
  imports: [CustomButtonComponent],
  templateUrl: './feed.component.html',
  styleUrl: './feed.component.scss'
})
export class FeedComponent {

  auth: Auth = inject(Auth);

  ngOnInit() {
    console.log(this.auth.currentUser)
  }

}
