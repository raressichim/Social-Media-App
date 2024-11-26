import { User } from './User';

export interface Message {
  content: string;
  sender: User;
  receirver: User;
}
