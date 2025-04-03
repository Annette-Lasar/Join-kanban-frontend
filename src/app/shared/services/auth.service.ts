import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, forkJoin } from 'rxjs';
import { tap } from 'rxjs/operators';
import { BASE_URL } from '../constants/global-constants.data';
import { User } from '../interfaces/user.interface';
import { LocalStorageService } from './local-storage.service';
import { DataService } from './data.service';


@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private userSubject = new BehaviorSubject<User | null>(
    this.loadUserFromStorage()
  );
  userSubject$: Observable<User | null> =
    this.userSubject.asObservable();

  private isAuthenticatedSubject = new BehaviorSubject<boolean>(
    this.hasToken()
  );
  isAuthenticated$: Observable<boolean> =
    this.isAuthenticatedSubject.asObservable();

  constructor(
    private http: HttpClient,
    private localStorageService: LocalStorageService,
    private dataService: DataService
  ) {}

  guestLogin(): Observable<Partial<User>> {
    return this.http
      .get<Partial<User>>(`${BASE_URL}/guest-login/`)
      .pipe(tap((response) => this.storeUserData(response, 'Guest')));
  }

  login(username: string, password: string): Observable<User> {
    return this.http
      .post<User>(`${BASE_URL}/login/`, { username, password })
      .pipe(tap((response) => this.storeUserData(response, 'User')));
  }

  private storeUserData(
    response: Partial<User>,
    userType: 'User' | 'Guest'
  ): void {
    localStorage.setItem('authToken', response.token || '');
    localStorage.setItem('userId', response.id?.toString() || '');
    localStorage.setItem('userName', response.username || '');
    localStorage.setItem('userFirstName', response.firstname || '');
    localStorage.setItem('userLastName', response.lastname || '');
    localStorage.setItem('userType', userType || '');

    const user: User = {
      token: response.token || '',
      id: response.id!,
      username: response.username!,
      firstname: response.firstname || '',
      lastname: response.lastname || '',
      userType: userType,
    };
    this.userSubject.next(user);
  }

  private loadUserFromStorage(): User | null {
    const token = this.localStorageService.getAuthTokenFromLocalStorage();
    const id = this.localStorageService.getUserIdFromLocalStorage();
    const userName = this.localStorageService.getUserNameFromLocalStorage();
    const firstName =
      this.localStorageService.getUserFirstNameFromLocalStorage();
    const lastName = this.localStorageService.getUserLastNameFromLocalStorage();
    const userType = this.localStorageService.getUserTypeFromLocalStorage();

    if (id && userType) {
      return {
        id: id,
        username: userName,
        firstname: firstName || '',
        lastname: lastName || '',
        userType: userType,
        token: token,
      };
    }
    return null;
  }

  isUserLoggedIn(): boolean {
    const userType = this.localStorageService.getUserTypeFromLocalStorage();
    return userType === 'User' || userType === 'Guest';
  }

/*   logout(): void {
    const userType = this.localStorageService.getUserTypeFromLocalStorage();
    const userId = this.localStorageService.getUserIdFromLocalStorage();
  
    if (userType === 'Guest' && userId === 4) {
      forkJoin([
        this.dataService.resetGuestContacts(),
        this.dataService.resetGuestTasks()
      ]).subscribe({
        next: () => {
          console.log('Guest data reset complete.');
          this.doLogout();
        },
        error: (err) => {
          console.error('Reset failed:', err);
          this.doLogout(); 
        }
      });
    } else {
      this.doLogout();
    }
  } */

    logout(): void {
      const userType = this.localStorageService.getUserTypeFromLocalStorage();
      const userId = this.localStorageService.getUserIdFromLocalStorage();
    
      if (userType === 'Guest' && userId === 4) {
        this.resetGuestData();
      } else {
        this.doLogout();
      }
    }
  
    resetGuestData(): void {
      forkJoin([
        this.dataService.resetGuestContacts(),
        this.dataService.resetGuestTasks()
      ]).subscribe({
        next: () => {
          console.log('Guest data reset complete.');
          this.doLogout();
        },
        error: (err) => {
          console.error('Reset failed:', err);
          this.doLogout(); 
        }
      });
    }

  private doLogout(): void {
    this.localStorageService.clearLocalStorage();
    this.userSubject.next(null);
  }

  hasToken(): boolean {
    return !!this.localStorageService.getAuthTokenFromLocalStorage();
  }

  resetUserSubject(): void {
    this.userSubject.next(null);
  }
}
