import { Component, Input } from '@angular/core';

@Component({
  selector: 'Snackbar',
  standalone: true,
  template: `
    @if (show) {
    <div class="snackbar" >
      {{ message }}
    </div>
    }
  `,
  styleUrl: './snackbar.component.scss'
})
export class SnackbarComponent {
  @Input() message: string = '';
  show: boolean = false;

  display(message: string, duration: number = 3000) {
    this.message = message;
    this.show = true;
    setTimeout(() => this.show = false, duration);
  }
}
