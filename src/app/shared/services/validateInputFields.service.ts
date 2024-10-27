import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ValidatateInputFieldsService {
  checkIfNameIsValid(name: string): boolean {
    const nameRegEx = /^[A-Za-zÄÖÜäöüß]+(\s[A-Za-zÄÖÜäöüß]+)?$/;
    return name ? nameRegEx.test(name) : false;
  }

  checkIfEmailIsValid(email: string | undefined): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return email ? emailRegex.test(email) : true;
  }

  checkIfPhoneIsValid(phone: string | undefined): boolean {
    const phoneRegEx = /^[0-9+\-\/\s]*$/;
    return phone ? phoneRegEx.test(phone) : true;
  }
}
