import { CommonModule } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { HashtagInputComponent } from '@components/hashtag-input/hashtag-input.component';
import { PostComponent } from '@components/posts/post/post.component';
import { DUMMY_POSTS } from '@constants/posts.constants';
import { Post } from '@interfaces/post.interface';
import { getPosts, getPostsObservable } from '@services/post.service';

@Component({
  selector: 'app-posts',
  standalone: true,
  imports: [CommonModule, HashtagInputComponent, PostComponent],
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.css'],
})
export class PostsComponent implements OnInit {
  @Output() showCreatePostModal = new EventEmitter<void>();
  posts: Post[] = [];

  ngOnInit(): void {
    const hasPosts = getPosts().length;

    if (!hasPosts) {
      localStorage.setItem('posts', JSON.stringify(DUMMY_POSTS));
    }

    getPostsObservable().subscribe((posts) => {
      this.posts = posts;
    });
  }

  openCreatePostModal() {
    this.showCreatePostModal.emit();
  }

  handlePostClick(event: any) {
    console.log('🚀 ~ PostsComponent ~ handlePostClick ~ post:', event);
    getPosts();
  }
}
