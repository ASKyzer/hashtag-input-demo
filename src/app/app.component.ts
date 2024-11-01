import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { HashtagInputComponent } from '@components/hashtag-input/hashtag-input.component';
import { CreatePostComponent } from '@components/posts/create-post/create-post.component';
import { PostsComponent } from '@components/posts/posts/posts.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, HashtagInputComponent, CreatePostComponent, PostsComponent],
  template: `<main>
    <div class="container">
      <div class="title">
        <h3 class="title-text">For you</h3>
        <div class="title-icon">
          <svg width="48px" height="48px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M16.5303 8.96967C16.8232 9.26256 16.8232 9.73744 16.5303 10.0303L12.5303 14.0303C12.2374 14.3232 11.7626 14.3232 11.4697 14.0303L7.46967 10.0303C7.17678 9.73744 7.17678 9.26256 7.46967 8.96967C7.76256 8.67678 8.23744 8.67678 8.53033 8.96967L12 12.4393L15.4697 8.96967C15.7626 8.67678 16.2374 8.67678 16.5303 8.96967Z"
              fill="#ffe7ee"
            />
          </svg>
        </div>
      </div>
      <app-posts (showCreatePostModal)="openModal()" />
    </div>
    <app-create-post #createPostComponent />
  </main>`,
  styles: [
    `
      main {
        width: 100%;
      }

      .container {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        max-width: 1200px;
        margin: 0 auto;
      }

      .title {
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .title-text {
        color: var(--secondary-lightest);
        font-size: 1.5em;
        font-weight: 400;
      }

      .title-icon {
        margin-left: 0.5rem;
        margin-top: 11px;
        cursor: pointer;
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
