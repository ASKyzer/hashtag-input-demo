import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { HashtagInputComponent } from '@components/hashtag-input/hashtag-input.component';

interface Post {
  username: string;
  avatarUrl: string;
  timestamp: string;
  content: string;
  imageUrl?: string;
  likes: number;
  comments: number;
  shares: number;
}

@Component({
  selector: 'app-post',
  standalone: true,
  imports: [CommonModule, HashtagInputComponent],
  templateUrl: './post.component.html',
  styleUrl: './post.component.css',
})
export class PostComponent {
  @Input() post!: Post;
}
