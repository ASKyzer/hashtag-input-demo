export interface Post {
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
