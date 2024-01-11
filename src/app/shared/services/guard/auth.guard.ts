import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { take, tap, } from 'rxjs';
import { AuthService } from '../auth/auth.service';

export const authGuard: CanActivateFn = (route, state) => {

  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.isAuthenticated$().pipe(
    take(1),
    tap((isAuthenticated: boolean) => {
      if (!isAuthenticated) {
        router.navigateByUrl('/sign-in');
      }
    })
  );
};
