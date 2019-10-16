export interface Message {
  message: string;
  timestamp?: IDate;
  sentBy: string;
  outcome?: boolean;
  fileMessage?: boolean;
}

interface IDate {
  toDate: () => Date;
}
