import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Groups } from '../interfaces/groups.interface';
import { Contact } from '../interfaces/contact.interface';

@Injectable({
  providedIn: 'root',
})
export class GroupContactsService {
  private groupContactsSubject = new BehaviorSubject<Groups>({});
  groupContactsSubject$ = this.groupContactsSubject.asObservable();

  groupContactsAlphabetically(contactsList: Contact[] | null): void {
    if (contactsList) {
      const groups = contactsList.reduce((accumulator, contact) => {
        const lastNameInitial =
          contact && contact.name
            ? contact.name.split(' ').pop()?.charAt(0).toUpperCase() ?? ''
            : '';

        if (!accumulator[lastNameInitial]) {
          accumulator[lastNameInitial] = [];
        }
        accumulator[lastNameInitial].push(contact);
        return accumulator;
      }, {} as { [key: string]: Contact[] });

      this.groupContactsSubject.next(groups);
    }
  }
}
