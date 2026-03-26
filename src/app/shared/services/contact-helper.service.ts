import { Injectable } from '@angular/core';
import { Contact } from '../interfaces/contact.interface.js';

@Injectable({
  providedIn: 'root',
})
export class ContactHelperService {
  getInitials(contact: Contact): string {
    if (contact.first_name && contact.last_name) {
      return (
        contact.first_name.trim().charAt(0) + contact.last_name.trim().charAt(0)
      ).toUpperCase();
    }

    return contact.name?.trim().charAt(0).toUpperCase() || '';
  }
}
