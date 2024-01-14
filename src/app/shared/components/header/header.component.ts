import { Component, inject } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { Router, RouterModule } from '@angular/router';
import { SnackbarService } from '../snackbar/snackbar.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {

  private readonly router: Router = inject(Router);
  private readonly auth: Auth = inject(Auth);
  private readonly snackbarService: SnackbarService = inject(SnackbarService);

  toHome() {
    this.router.navigateByUrl('/app/feed');
  }

  async logout() {
    try {
      await this.auth.signOut();
      this.router.navigateByUrl('/sign-in');
    } catch (error) {
      this.snackbarService.show('Logout Failed');
    }
  }

}
