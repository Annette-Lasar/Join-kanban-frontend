import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BASE_URL } from '../constants/global-constants.data';
import { RegistrationData, RegistrationResponse } from '../interfaces/registration.interface';

@Injectable({
  providedIn: 'root',
})
export class RegistrationService {

  constructor(private http: HttpClient) {}

  registerUser(userData: RegistrationData): Observable<RegistrationResponse> {
    return this.http.post<RegistrationResponse>(`${BASE_URL}/registration/`, userData);
  }
}
