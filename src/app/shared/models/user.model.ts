export interface User {
  email: string;
  password?: string;
  displayName?: string;
  photoURL?: string;
  sender?: boolean;
  receiver?: boolean;
  online?: boolean;
}

export interface Request {
  sender: string;
  receiver: string;
}

export interface Status {
  email: string;
  status: string;
}
