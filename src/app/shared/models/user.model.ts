export interface User {
  email: string;
  password?: string;
  displayName?: string;
  photoURL?: string;
  sender?: boolean;
  receiver?: boolean;
}

export interface Request {
  sender: string;
  receiver: string;
}
