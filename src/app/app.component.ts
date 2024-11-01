import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { HashtagInputComponent } from '@components/hashtag-input/hashtag-input.component';
import { CreatePostComponent } from '@components/posts/create-post/create-post.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, HashtagInputComponent, CreatePostComponent],
  template: `<main>
    <div class="container">
      <h1 class="title">Hashtag Input Demo</h1>
      <button (click)="openModal()">Open Modal</button>
    </div>
    <app-create-post #createPostComponent />
  </main>`,
  styles: [
    `
      main {
        padding: 2rem 2rem 0;
        width: 100%;
      }

      .container {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        max-width: 1200px;
        margin: 0 auto;
        padding: 2rem 2rem 0;
      }

      .title {
        color: var(--secondary-lightest);
      }
    `,
  ],
})
export class AppComponent {
  @ViewChild('createPostComponent') createPostComponent!: CreatePostComponent;

  openModal() {
    this.createPostComponent.openModal();
  }
}
