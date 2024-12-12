import { User } from './User';

export interface Message {
  id: number;
  content: string;
  sender: User;
  receiver: User;
  attachment: File;
}
