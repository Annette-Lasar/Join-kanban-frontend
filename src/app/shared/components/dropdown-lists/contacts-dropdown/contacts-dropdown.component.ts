import {
  Component,
  Input,
  HostListener,
  OnInit,
  OnChanges,
  OnDestroy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Task } from '../../../interfaces/task.interface';
import { Contact } from '../../../interfaces/contact.interface';
import { TaskService } from '../../../services/task.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'join-contacts-dropdown',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './contacts-dropdown.component.html',
  styleUrl: './contacts-dropdown.component.scss',
})
export class ContactsDropdownComponent implements OnInit, OnChanges, OnDestroy {
  @Input() task: Task | null = null;
  @Input() contacts: Contact[] = [];
  @Input() isNewTask: boolean = false;
  
  filteredContacts: Contact[] | undefined = this.task?.contacts;
  assignedContacts: Contact[] = [];
  searchTerm: string = '';
  isContactsListVisible: boolean = false;
  
  private subscriptions: Subscription = new Subscription();

  constructor(private taskService: TaskService) {}

  ngOnInit(): void {
    this.initializeContacts();
    this.subscribeToAssignedContactsSubject();
  }

  initializeContacts(): void {
    if (this.isNewTask) {
      this.filteredContacts = [...this.contacts];
      this.assignedContacts = [];
    } else if (this.task) {
      this.filteredContacts = [...this.task.contacts];
      this.assignedContacts = [...this.task.contacts];
    } else {
      console.error(
        'Fehler: Weder bestehende Aufgabe noch neue Aufgabe erkannt.'
      );
      this.filteredContacts = [];
      this.assignedContacts = [];
    }
  }

  subscribeToAssignedContactsSubject(): void {
    const subscription = this.taskService.assignedContactsSubject$.subscribe(
      (assignedContacts) => {
        this.assignedContacts = assignedContacts;
      }
    );
    this.subscriptions.add(subscription);
  }

  ngOnChanges(): void {
    this.initializeContacts();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
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
    return (
      this.task?.contacts.some((contact) => contact.id === contactId) ?? false
    );
  }


  toggleContactAssignment(contact: Contact): void {
    let currentContacts = this.taskService.getAssignedContacts();

    const index = currentContacts.findIndex((c) => c.id === contact.id);

    if (index === -1) {
      currentContacts = [...currentContacts, contact];
    } else {
      currentContacts = currentContacts.filter((c) => c.id !== contact.id); // Kontakt entfernen
    }

    this.taskService.setAssignedContacts(currentContacts);

    if (this.task) {
      this.task.contacts = currentContacts;
    }
  }


}
