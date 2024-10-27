import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Contact } from '../interfaces/contact.interface';

@Injectable({
  providedIn: 'root',
})
export class ContactService {
  private contactsSubject = new BehaviorSubject<Contact[]>([]);
  contacts$ = this.contactsSubject.asObservable();

  private showDetailsSubject = new BehaviorSubject<boolean>(false);
  showDetails$ = this.showDetailsSubject.asObservable();

  private currentContactSubject = new BehaviorSubject<Contact | null>(null);
  currentContact$ = this.currentContactSubject.asObservable();

  constructor() {}

  initializeContacts(dummyContacts: Contact[]) {
    if (this.contactsSubject.getValue().length === 0) {
      this.contactsSubject.next(dummyContacts); // Setzt Dummy-Kontakte nur, wenn leer
    }
  }

  addContact(newContact: Contact) {
    const currentContacts = this.contactsSubject.getValue();
    const updatedContacts = [...currentContacts, newContact];
    this.contactsSubject.next(updatedContacts);
  }

  setShowDetails(value: boolean) {
    this.showDetailsSubject.next(value);
  }

  setCurrentContact(contact: Contact | null) {
    this.currentContactSubject.next(contact);
  }
}
