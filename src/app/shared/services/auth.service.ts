import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { BASE_URL } from '../data/global-variables.data';
import { LoginResponse } from '../interfaces/login.interface';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private tokenKey = 'auth_token';
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(
    this.hasToken()
  );
  isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  constructor(private http: HttpClient) {}

  guestLogin(): Observable<Partial<LoginResponse>> {
    return this.http
      .get<Partial<LoginResponse>>(`${BASE_URL}/guest-login/`)
      .pipe(tap((response) => this.storeUserData(response, 'Guest')));
  }

  login(username: string, password: string): Observable<LoginResponse> {
    return this.http
      .post<LoginResponse>(`${BASE_URL}/login/`, { username, password })
      .pipe(tap((response) => this.storeUserData(response, 'User')));
  }


  private storeUserData(
    response: Partial<LoginResponse>,
    userType: 'User' | 'Guest'
  ): void {
    console.log('response: ', response);
    console.log('response-id: ', response.id);
    localStorage.setItem('authToken', response.token || '');
    localStorage.setItem('userId', response.id?.toString() || '');
    localStorage.setItem('userName', response.username || '');
    localStorage.setItem('userType', userType);
    if (userType === 'User') {
      localStorage.setItem('userEmail', response.email || '');
      localStorage.setItem('userFirstName', response.firstname || '');
      localStorage.setItem('userLastName', response.lastname || '');
    }

    this.isAuthenticatedSubject.next(true);
  }

  hasToken(): boolean {
    return !!localStorage.getItem(this.tokenKey);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  logout(): void {
    localStorage.clear();
    this.isAuthenticatedSubject.next(false);
  }
}
