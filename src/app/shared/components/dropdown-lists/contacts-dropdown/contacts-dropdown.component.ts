import { Component, Input, HostListener } from '@angular/core';
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
export class ContactsDropdownComponent {
  @Input() task: Task | null = null;
  @Input() contacts: Contact[] = [];
  filteredContacts: Contact[] | undefined = this.task?.contacts;
  searchTerm: string = '';
  isContactsListVisible: boolean = false;

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
}
