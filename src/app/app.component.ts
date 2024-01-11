import { Component, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { SnackbarComponent } from './shared/components/snackbar/snackbar.component';
import { SnackbarService } from './shared/components/snackbar/snackbar.service';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, SnackbarComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'brevi-post';
  showHeader: boolean = true;

  @ViewChild(SnackbarComponent) snackbarComponent!: SnackbarComponent;

  private readonly snackbarService: SnackbarService = inject(SnackbarService);


  ngAfterViewInit() {
    this.snackbarService.bindSnackbarComponent(this.snackbarComponent);
  }

}
