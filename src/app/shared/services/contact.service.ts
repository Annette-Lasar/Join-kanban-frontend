import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Contact } from '../interfaces/contact.interface';
import { DataService } from './data.service';
import { GroupContactsService } from './group-contacts.service';

@Injectable({
  providedIn: 'root',
})
export class ContactService {
  private contactsSubject = new BehaviorSubject<Contact[]>([]);
  contacts$ = this.contactsSubject.asObservable();

  private currentContactSubject = new BehaviorSubject<Contact | null>(null);
  currentContact$ = this.currentContactSubject.asObservable();

  constructor(private dataService: DataService,
    private groupContactsService: GroupContactsService
  ) {}

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

  addContactOptimistically(contact: Omit<Contact, 'id'>): void {
    const currentContacts = this.contactsSubject.getValue();
    const optimisticContact = {
      ...contact,
      id: -1, 
    } as Contact;

    const updatedContacts = [...currentContacts, optimisticContact];
  
    this.contactsSubject.next(updatedContacts);
    this.groupContactsService.groupContactsAlphabetically(updatedContacts);
  }

  updateContactListAfterAdd(confirmedContact: Contact): void {
    const currentContacts = this.contactsSubject.getValue();
  
    const filteredContacts = currentContacts.filter(c => c.id !== -1);
  
    const updatedContacts = [...filteredContacts, confirmedContact];
    this.contactsSubject.next(updatedContacts);
  
    this.groupContactsService.groupContactsAlphabetically(updatedContacts);
  }


  updateContactListAfterEdit(updatedContact: Contact): void {
    const currentContacts = this.contactsSubject.getValue();
  
    const updatedContacts = currentContacts.map((contact) =>
      contact.id === updatedContact.id ? updatedContact : contact
    );
  
    this.contactsSubject.next(updatedContacts);
    this.groupContactsService.groupContactsAlphabetically(updatedContacts);
  }
  
  
  
}
