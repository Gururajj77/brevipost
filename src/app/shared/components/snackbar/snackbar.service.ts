import { Injectable } from '@angular/core';
import { SnackbarComponent } from './snackbar.component';

@Injectable({
  providedIn: 'root'
})
export class SnackbarService {
  private snackbarComponent?: SnackbarComponent;

  bindSnackbarComponent(component: SnackbarComponent) {
    this.snackbarComponent = component;
  }

  show(message: string, duration: number = 3000) {
    this.snackbarComponent?.display(message, duration);
  }
}
