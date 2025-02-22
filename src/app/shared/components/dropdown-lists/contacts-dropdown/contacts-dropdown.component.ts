import { Component, Input, HostListener, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Task } from '../../../interfaces/task.interface';
import { Contact } from '../../../interfaces/contact.interface';

@Component({
  selector: 'join-contacts-dropdown',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './contacts-dropdown.component.html',
  styleUrl: './contacts-dropdown.component.scss',
})
export class ContactsDropdownComponent implements OnInit {
  @Input() task: Task | null = null;
  @Input() contacts: Contact[] = [];
  filteredContacts: Contact[] | undefined = this.task?.contacts;
  assignedContacts: Contact[] = [];
  searchTerm: string = '';
  isContactsListVisible: boolean = false;

  ngOnInit(): void {
    this.assignContactsToProperty();
  }

  assignContactsToProperty() {
    if (this.task) {
      this.assignedContacts = this.task.contacts;
      console.log('assignedContacts: ', this.assignedContacts);
    }
  }

  toggleContactsList(event: Event): void {
    this.isContactsListVisible = !this.isContactsListVisible;
    event.stopPropagation();
    this.filterContacts();
  }

  @HostListener('document:click', ['$event'])
  closeDropdown(event: Event) {
    const dropdown = document.querySelector('.contacts-wrapper');
    const inputField = document.querySelector('.search-contact-input');
    const contactList = document.querySelector('.contacts-list');

    if (
      dropdown &&
      !dropdown.contains(event.target as Node) &&
      inputField &&
      !inputField.contains(event.target as Node) &&
      contactList &&
      !contactList.contains(event.target as Node)
    ) {
      this.isContactsListVisible = false;
      this.searchTerm = '';
      this.filterContacts();
    }
  }

  filterContacts(): void {
    const term = this.searchTerm.toLowerCase().trim();

    this.filteredContacts = this.contacts.filter((contact) =>
      contact.name.toLowerCase().includes(term)
    );
  }

  isContactAssigned(contactId?: number): boolean {
    if (contactId) {
    }
    return (
      this.task?.contacts.some((contact) => contact.id === contactId) ?? false
    );
  }

  toggleContactAssignment(contact: Contact): void {
    if (!this.task) return;

    const index = this.task.contacts.findIndex((c) => c.id === contact.id);

    if (index === -1) {
      // Kontakt ist noch nicht in der Liste → Hinzufügen
      this.task.contacts.push(contact);
    } else {
      // Kontakt existiert bereits → Entfernen
      this.task.contacts.splice(index, 1);
    }
  }
}
