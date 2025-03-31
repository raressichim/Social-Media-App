import { Post } from './Post';
import { User } from './User';

export interface Comment {
  user: User;
  content: string;
  post: Post;
}
