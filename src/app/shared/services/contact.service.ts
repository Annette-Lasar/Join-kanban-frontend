import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Contact } from '../interfaces/contact.interface';

@Injectable({
  providedIn: 'root',
})
export class ContactService {
  private showDetailsSubject = new BehaviorSubject<boolean>(false);
  showDetails$ = this.showDetailsSubject.asObservable();

  private currentContactSubject = new BehaviorSubject<Contact | null>(null);
  currentContact$ = this.currentContactSubject.asObservable();



  setShowDetails(value: boolean) {
    this.showDetailsSubject.next(value);
  }


  setCurrentContact(contact: Contact | null) {
    this.currentContactSubject.next(contact);
  }
}
