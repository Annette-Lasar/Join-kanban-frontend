import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { BASE_URL } from '../constants/global-constants.data';
import { LocalStorageService } from './local-storage.service';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  constructor(
    private http: HttpClient,
    private localStorageService: LocalStorageService
  ) {}

  fetchData<T>(
    endpoint: string,
    subject: BehaviorSubject<T[]>
  ): Observable<T[]> {
    return this.http
      .get<T[]>(`${BASE_URL}/${endpoint}/`, { headers: this.getHeaders() })
      .pipe(
        tap((data) => {
          subject.next(data);
        })
      );
  }

  addData<T>(
    endpoint: string,
    item: T,
    subject?: BehaviorSubject<T[]>
  ): Observable<T> {
    return this.http
      .post<T>(`${BASE_URL}/${endpoint}/`, item, { headers: this.getHeaders() })
      .pipe(tap((newItem) => subject?.next([...(subject?.value ?? []), newItem])));
  }

  updateData<T>(
    endpoint: string,
    id: number,
    item: T,
    subject: BehaviorSubject<T[]>
  ): Observable<T> {
    return this.http
      .put<T>(`${BASE_URL}/${endpoint}/${id}/`, item, {
        headers: this.getHeaders(),
      })
      .pipe(
        tap((updatedItem) => {
          const updatedList = subject.value.map((obj) =>
            (obj as any).id === id ? updatedItem : obj
          );
          subject.next(updatedList);
        })
      );
  }

  patchData<T>(
    endpoint: string,
    id: number,
    item: Partial<T>,
    subject: BehaviorSubject<T[]>
  ): Observable<T> {
    return this.http
      .patch<T>(`${BASE_URL}/${endpoint}/${id}/`, item, {
        headers: this.getHeaders(),
      })
      .pipe(
        tap((updatedItem) => {
          const updatedList = subject.value.map((obj) =>
            (obj as any).id === id ? updatedItem : obj
          );
          subject.next(updatedList);
        })
      );
  }

  deleteData<T>(
    endpoint: string,
    id: number,
    subject: BehaviorSubject<T[]>
  ): Observable<void> {
    return this.http
      .delete<void>(`${BASE_URL}/${endpoint}/${id}/`, {
        headers: this.getHeaders(),
      })
      .pipe(
        tap(() => {
          subject.next(subject.value.filter((obj) => (obj as any).id !== id));
        })
      );
  }

  private getHeaders(): HttpHeaders {
    const token = this.localStorageService.getAuthTokenFromLocalStorage();
    return new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Token ${token}`,
    });
  }

  resetGuestContacts(): Observable<any> {
    return this.http.post(`${BASE_URL}/reset-guest-contacts/`, null, {
      headers: this.getHeaders(),
    });
  }

  
  resetGuestTasks(): Observable<any> {
    return this.http.post(`${BASE_URL}/reset-guest-tasks/`, null, {
      headers: this.getHeaders(),
    });
  }
  
}
