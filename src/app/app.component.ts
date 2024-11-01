import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { HashtagInputComponent } from '@components/hashtag-input/hashtag-input.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, HashtagInputComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {}
