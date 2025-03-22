export interface User {
    token: string;
    id: number | null;
    username: string;
    firstname?: string;
    lastname?: string;
    userType?: 'User' | 'Guest';
  }
  