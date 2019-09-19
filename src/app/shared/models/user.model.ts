export interface User {
  email: string;
  password?: string;
  displayName?: string;
  photoURL?: string;
}

export interface Request {
  sender: string;
  receiver: string;
}
