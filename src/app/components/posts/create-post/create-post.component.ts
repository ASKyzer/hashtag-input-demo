import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { HashtagInputComponent } from '@components/hashtag-input/hashtag-input.component';
import { Post } from '@interfaces/post.interface';
import { createPost } from '@services/post.service';

/**
 * CreatePostComponent
 *
 * A modal component that handles the creation of new posts with hashtag support.
 * Provides a rich text editor interface with content preservation warnings and
 * post creation functionality.
 *
 * Features:
 * - Modal interface for post creation
 * - Rich text editor with hashtag support
 * - Content preservation warning
 * - Post creation and submission
 * - Action item handling
 */
@Component({
  selector: 'app-create-post',
  standalone: true,
  imports: [HashtagInputComponent],
  templateUrl: './create-post.component.html',
  styleUrls: ['./create-post.component.css'],
})
export class CreatePostComponent {
  /** Reference to the hashtag input editor component */
  @ViewChild('postContent') postContent!: HashtagInputComponent;

  /** Array of existing posts for ID generation */
  @Input() posts!: Post[];

  /** Emits when a post is created */
  @Output() onPostClick = new EventEmitter<boolean>();

  /** Controls visibility of the create post modal */
  showModal = false;

  /** Current content of the post being created */
  content = '';

  /**
   * Opens the create post modal
   */
  openModal() {
    this.showModal = true;
  }

  /**
   * Closes the create post modal with optional content preservation warning
   * @param isPost Whether the close is triggered by post creation
   */
  closeModal(isPost: boolean = false) {
    if (this.content.trim() && !isPost) {
      const confirmClose = confirm('You have unsaved content. Are you sure you want to close?');
      if (!confirmClose) return;
    }
    this.showModal = false;
    this.content = '';
  }

  /**
   * Handles clicks on the modal overlay
   * Closes the modal with content preservation check
   */
  handleOverlayClick() {
    this.closeModal();
  }

  /**
   * Updates the content when the editor content changes
   */
  onEditorUpdate() {
    this.content = this.postContent.editor.getText();
  }

  /**
   * Handles clicks on action items (placeholder)
   * @param action The action identifier
   */
  handleActionItemClick(action: string) {
    console.log(action, 'icon clicked');
    // TODO: Implement action
  }

  /**
   * Handles post creation
   * - Validates content
   * - Creates new post object
   * - Submits post
   * - Closes modal
   * - Notifies parent component
   */
  handlePostClick() {
    if (!this.content.trim()) return;

    const postsNumber = this.posts?.length;
    const newPost: Post = {
      content: this.content,
      username: 'askyzer',
      avatarUrl: 'https://github.com/askyzer.png',
      timestamp: new Date().toISOString(),
      likes: 0,
      comments: 0,
      shares: 0,
      id: postsNumber + 1,
    };

    createPost(newPost);
    this.closeModal(true);
    this.onPostClick.emit(true);
  }
}
