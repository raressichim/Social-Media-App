import { User } from './User';

export interface Message {
  content: string;
  sender: User;
  receiver: User;
  attachment: string;
  type: string;
  fileUrl: string;
}
