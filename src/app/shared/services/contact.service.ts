import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Contact } from '../interfaces/contact.interface';
import { DataService } from './data.service';

@Injectable({
  providedIn: 'root',
})
export class ContactService {
  private contactsSubject = new BehaviorSubject<Contact[]>([]);
  contacts$ = this.contactsSubject.asObservable();

  private currentContactSubject = new BehaviorSubject<Contact | null>(null);
  currentContact$ = this.currentContactSubject.asObservable();

  constructor(private dataService: DataService) {}

  fetchData(): Observable<Contact[]> {
    return this.dataService.fetchData<Contact>(
      'contacts',
      this.contactsSubject
    );
  }

  addData(contact: Contact): Observable<Contact> {
    return this.dataService.addData<Contact>(
      'contacts',
      contact,
      this.contactsSubject
    );
  }

  updateData(contactId: number, updatedContact: Contact): Observable<Contact> {
    return this.dataService.updateData<Contact>(
      'contacts',
      contactId,
      updatedContact,
      this.contactsSubject
    );
  }

  patchData(
    contactId: number,
    partialUpdate: Partial<Contact>
  ): Observable<Contact> {
    return this.dataService.patchData<Contact>(
      'contacts',
      contactId,
      partialUpdate,
      this.contactsSubject
    );
  }

  deleteData(contactId: number): Observable<void> {
    return this.dataService.deleteData<Contact>(
      'contacts',
      contactId,
      this.contactsSubject
    );
  }

  setCurrentContact(contact: Contact | null) {
    this.currentContactSubject.next(contact);
  }
}
