import { Post } from '@interfaces/post.interface';
import { BehaviorSubject } from 'rxjs';

export const postsSubject = new BehaviorSubject<Post[]>([]);

export const createPost = (post: Post) => {
  const posts = JSON.parse(localStorage.getItem('posts') || '[]');
  const updatedPosts = [...posts, post];
  localStorage.setItem('posts', JSON.stringify(updatedPosts));
  postsSubject.next(updatedPosts.sort((a, b) => b.id - a.id));
};

export const deletePost = (id: number) => {
  const posts = JSON.parse(localStorage.getItem('posts') || '[]');
  const updatedPosts = posts.filter((post: Post) => post.id !== id);
  localStorage.setItem('posts', JSON.stringify(updatedPosts));
  postsSubject.next(updatedPosts.sort((a, b) => b.id - a.id));
};

export const getPosts = (): Post[] => {
  const posts = JSON.parse(localStorage.getItem('posts') || '[]');
  const sortedPosts = posts.sort((a, b) => b.id - a.id);
  postsSubject.next(sortedPosts);
  return sortedPosts;
};

export const getPostsObservable = () => {
  return postsSubject.asObservable();
};
