import { Component, ViewChild } from '@angular/core';
import { HashtagInputComponent } from '@components/hashtag-input/hashtag-input.component';

@Component({
  selector: 'app-create-post',
  standalone: true,
  imports: [HashtagInputComponent],
  templateUrl: './create-post.component.html',
  styleUrls: ['./create-post.component.css'],
})
export class CreatePostComponent {
  @ViewChild('postContent') postContent!: HashtagInputComponent;
  showModal = false;
  content = '';

  openModal() {
    this.showModal = true;
  }

  closeModal() {
    if (this.content.trim()) {
      const confirmClose = confirm('You have unsaved content. Are you sure you want to close?');
      if (!confirmClose) return;
    }
    this.showModal = false;
    this.content = '';
  }

  handleOverlayClick() {
    this.closeModal();
  }

  onEditorUpdate() {
    this.content = this.postContent.editor.getText();
  }

  handleActionItemClick(action: string) {
    console.log(action, 'icon clicked');
    // TODO: Implement action
  }
}
