import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
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
}
