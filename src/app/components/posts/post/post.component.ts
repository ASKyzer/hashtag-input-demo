import { CommonModule } from '@angular/common';
import { Component, EventEmitter, HostListener, Input, Output } from '@angular/core';
import { HashtagInputComponent } from '@components/hashtag-input/hashtag-input.component';
import { Post } from '@interfaces/post.interface';
import { TimeAgoPipe } from '@pipes/time-ago.pipe';

@Component({
  selector: 'app-post',
  standalone: true,
  imports: [CommonModule, HashtagInputComponent, TimeAgoPipe],
  templateUrl: './post.component.html',
  styleUrl: './post.component.css',
})
export class PostComponent {
  @Input() post!: Post;
  @Output() deletePost = new EventEmitter<number>();
  isDropdownOpen = false;

  @HostListener('document:click', ['$event'])
  closeDropdown(event: Event) {
    if (!(event.target as Element).closest('.post-menu')) {
      this.isDropdownOpen = false;
    }
  }

  toggleDropdown(event: Event) {
    event.stopPropagation();
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  handleDelete(id: number) {
    if (confirm('Are you sure you want to delete this post?')) {
      this.deletePost.emit(id);
    }
    this.isDropdownOpen = false;
  }
}
