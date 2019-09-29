export interface Message {
  message: string;
  timestamp: firebase.firestore.FieldValue;
  sentBy: string;
  outcome?: boolean;
}
