import { Injectable } from '@angular/core';
import { of, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ValidatateInputFieldsService {
  checkIfNameIsValid(name: string): Observable<boolean> {
    const nameRegEx = /^[A-Za-zÄÖÜäöüß]+(\s[A-Za-zÄÖÜäöüß]+)?$/;
    return of(name ? nameRegEx.test(name.trim()) : false);
  }

  checkIfEmailIsValid(email: string | undefined): Observable<boolean> {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return of(email ? emailRegex.test(email.trim()) : true);
  }

  checkIfPhoneIsValid(phone: string | undefined): Observable<boolean> {
    const phoneRegEx = /^[0-9+\-\/\s]*$/;
    return of(phone ? phoneRegEx.test(phone.trim()) : true);
  }
}
