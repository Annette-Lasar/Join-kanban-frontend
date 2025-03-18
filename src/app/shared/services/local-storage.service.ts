import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LocalStorageService {
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
