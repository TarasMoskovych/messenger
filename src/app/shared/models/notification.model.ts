import { IDate, User } from 'src/app/shared/models';

export interface Notification {
  receiver: User;
  receiverEmail: string;
  sender: User;
  senderEmail: string;
  type: string;
  timestamp: IDate;
}
