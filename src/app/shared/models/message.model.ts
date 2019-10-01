export interface Message {
  message: string;
  timestamp: IDate;
  sentBy: string;
  outcome?: boolean;
}

interface IDate {
  toDate: () => Date;
}
