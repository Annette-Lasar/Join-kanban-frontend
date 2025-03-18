import { Injectable } from '@angular/core';
import { BehaviorSubject, of, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ValidateInputFieldsService {
  private passwordIsValidSubject = new BehaviorSubject<boolean>(true);
  passwordIsValid$: Observable<boolean> =
    this.passwordIsValidSubject.asObservable();

  private passwordMatchSubject = new BehaviorSubject<boolean>(true);
  passwordMatchSubject$: Observable<boolean> =
    this.passwordMatchSubject.asObservable();

  private nameIsValidSubject = new BehaviorSubject<boolean>(true);
  nameIsValid$: Observable<boolean> = this.nameIsValidSubject.asObservable();

  private emailIsValidSubject = new BehaviorSubject<boolean>(true);
  emailIsValid$ = this.emailIsValidSubject.asObservable();

  private phoneIsValidSubject = new BehaviorSubject<boolean>(true);
  phoneIsValid$: Observable<boolean> = this.phoneIsValidSubject.asObservable();

  private passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/;

  private nameRegex = /^[A-Za-zÄÖÜäöüß]{2,}(\s[A-Za-zÄÖÜäöüß]{2,})?$/;

  private emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  private phoneRegex = /^[0-9+\-\/\s]*$/;

  checkIfPasswordIsValid(password: string | null): void {
    const isValid = password ? this.passwordRegex.test(password.trim()): false;
    this.passwordIsValidSubject.next(isValid);
  }

  checkIfNameIsValid(name: string | null): void {
    const isValid = name ? this.nameRegex.test(name.trim()) : false;
    this.nameIsValidSubject.next(isValid);
  }

  checkIfEmailIsValid(email: string | null): void {
    const isValid = email ? this.emailRegex.test(email.trim()) : false;
    this.emailIsValidSubject.next(isValid);
  }

  checkIfPhoneIsValid(phone: string): void {
    this.phoneIsValidSubject.next(this.phoneRegex.test(phone.trim()));
  }

  checkPasswordMatch(password: string, confirmPassword: string): void {
    this.passwordMatchSubject.next(password === confirmPassword);
  }
}
