export interface User {
    token: string;
    id: number;
    username: string;
    firstname?: string;
    lastname?: string;
    userType?: 'User' | 'Guest';
  }
  