import { Injectable } from '@angular/core';
import { User } from '../interfaces/user.interface';

@Injectable({
  providedIn: 'root',
})
export class LocalStorageService {
  getWholeUserObjectFromLocalStorage(): User | null {
    const userType = this.getUserTypeFromLocalStorage();
    const user: User = {
      token: this.getAuthTokenFromLocalStorage(),
      id: this.getUserIdFromLocalStorage(),
      username: this.getUserNameFromLocalStorage(),
      firstname: this.getUserFirstNameFromLocalStorage(),
      lastname: this.getUserLastNameFromLocalStorage(),
      userType:
        userType === 'User' || userType === 'Guest' ? userType : 'Guest',
    };
    return user;
  }

  getAuthTokenFromLocalStorage(): string {
    return localStorage.getItem('authToken') || '';
  }

  getUserFirstNameFromLocalStorage(): string {
    return localStorage.getItem('userFirstName') || '';
  }

  getUserLastNameFromLocalStorage(): string {
    return localStorage.getItem('userLastName') || '';
  }

  getUserIdFromLocalStorage(): number | null {
    return localStorage.getItem('userId')?.trim()
      ? parseInt(localStorage.getItem('userId')!, 10)
      : null;
  }

  getUserNameFromLocalStorage(): string {
    return localStorage.getItem('userName') || '';
  }

  getUserTypeFromLocalStorage(): 'User' | 'Guest' | '' {
    return (localStorage.getItem('userType') as 'User' | 'Guest') || '';
  }

  clearLocalStorage(): void {
    localStorage.clear();
  }
}
