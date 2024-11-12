import { User } from './User';

export interface Post {
  id: number;
  user: User;
  body: string;
  date: string;
  relativeTime: string;
}