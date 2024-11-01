import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { HashtagInputComponent } from '@components/hashtag-input/hashtag-input.component';
import { PostComponent } from '@components/posts/post/post.component';
interface Post {
  username: string;
  avatarUrl: string;
  timestamp: string;
  content: string;
  imageUrl?: string;
  likes: number;
  comments: number;
  shares: number;
  id: number;
}

@Component({
  selector: 'app-posts',
  standalone: true,
  imports: [CommonModule, HashtagInputComponent, PostComponent],
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.css'],
})
export class PostsComponent {
  @Output() showCreatePostModal = new EventEmitter<void>();

  posts: Post[] = [
    {
      username: 'jnnok78',
      avatarUrl: 'https://cdn.pixabay.com/photo/2017/09/01/21/53/sunglasses-2705642_1280.jpg',
      timestamp: '1d',
      content: 'Happy Halloween! 🎃👻 Here’s a throwback pic of Will and I carving our first pumpkin. #tbt #halloween',
      imageUrl:
        'https://plus.unsplash.com/premium_photo-1722556819999-e79ee1bb0077?q=80&w=4140&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      likes: 1,
      comments: 0,
      shares: 0,
      id: 1,
    },
    {
      username: 'goodgodabove',
      avatarUrl: 'https://cdn.pixabay.com/photo/2016/06/06/17/05/woman-1439909_1280.jpg',
      timestamp: '1d',
      content:
        'America deserves a president who can say the phrase “E Pluribus Unum” without sounding like a drunken baboon.',
      likes: 1200,
      comments: 14,
      shares: 37,
      id: 2,
    },
    {
      username: 'lopgirl',
      avatarUrl: 'https://cdn.pixabay.com/photo/2019/11/06/15/49/redhead-4606477_1280.jpg',
      timestamp: '1d',
      content:
        'I adopted Taco today. He was going to be euthanized. He’s only 1 and has been in the shelter since he was about 12 weeks old. #rescuedog #rescueismyfavoritebreed',
      imageUrl:
        'https://images.unsplash.com/photo-1503595855261-9418f48a991a?q=80&w=3497&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      likes: 0,
      comments: 0,
      shares: 0,
      id: 3,
    },
  ];

  openCreatePostModal() {
    this.showCreatePostModal.emit();
  }
}
