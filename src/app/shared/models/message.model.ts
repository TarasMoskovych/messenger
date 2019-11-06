export interface Message {
  author?: string;
  fileMessage?: boolean;
  group?: true;
  message: string;
  outcome?: boolean;
  photoURL?: string;
  sentBy: string;
  timestamp?: IDate;
}

export interface IDate {
  toDate: () => Date;
}
