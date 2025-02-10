import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { BASE_URL } from '../data/global-variables.data';

@Injectable({
  providedIn: 'root',
})
export class DataService {
    constructor(private http: HttpClient) {}

    /** 🟢 **GET**: Daten abrufen */
    fetchData<T>(endpoint: string, subject: BehaviorSubject<T[]>): Observable<T[]> {
      return this.http.get<T[]>(`${BASE_URL}/${endpoint}`, { headers: this.getHeaders() }).pipe(
        tap((data) => {
          subject.next(data);
        //   console.log(`Daten von ${endpoint} geladen:`, data);
        })
      );
    }

  
    /** 🔵 **POST**: Neuen Eintrag hinzufügen */
    addData<T>(endpoint: string, item: T, subject: BehaviorSubject<T[]>): Observable<T> {
      return this.http.post<T>(`${BASE_URL}/${endpoint}`, item, { headers: this.getHeaders() }).pipe(
        tap((newItem) => subject.next([...subject.value, newItem]))
      );
    }
  
    /** 🟡 **PUT**: Eintrag komplett ersetzen */
    updateData<T>(endpoint: string, id: number, item: T, subject: BehaviorSubject<T[]>): Observable<T> {
      return this.http.put<T>(`${BASE_URL}/${endpoint}/${id}/`, item, { headers: this.getHeaders() }).pipe(
        tap((updatedItem) => {
          const updatedList = subject.value.map(obj => (obj as any).id === id ? updatedItem : obj);
          subject.next(updatedList);
        })
      );
    }
  
    /** 🟠 **PATCH**: Teilweise aktualisieren */
    patchData<T>(endpoint: string, id: number, item: Partial<T>, subject: BehaviorSubject<T[]>): Observable<T> {
      return this.http.patch<T>(`${BASE_URL}/${endpoint}/${id}/`, item, { headers: this.getHeaders() }).pipe(
        tap((updatedItem) => {
          const updatedList = subject.value.map(obj => (obj as any).id === id ? updatedItem : obj);
          subject.next(updatedList);
        })
      );
    }
  
    /** 🔴 **DELETE**: Eintrag löschen */
    deleteData<T>(endpoint: string, id: number, subject: BehaviorSubject<T[]>): Observable<void> {
      return this.http.delete<void>(`${BASE_URL}/${endpoint}/${id}/`, { headers: this.getHeaders() }).pipe(
        tap(() => {
          subject.next(subject.value.filter(obj => (obj as any).id !== id));
        })
      );
    }
  
    /** 🛑 **Globale Methode für die Headers** */
    private getHeaders(): HttpHeaders {
      const token = localStorage.getItem('authToken') || '';
      return new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: `Token ${token}`,
      });
    }
}
