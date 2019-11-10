import { User } from 'src/app/shared/models';

export interface Notification {
  group: string;
  receiver: User;
  receiverEmail: string;
  sender: User;
  senderEmail: string;
  type: string;
  timestamp: firebase.firestore.FieldValue;
}

export enum NotificationTypes {
  AddFriend = 'addFriend',
  AddToGroup = 'addToGroup',
  Message = 'message',
  RemoveFriend = 'removeFriend',
  RemoveFromGroup = 'removeFromGroup',
}
