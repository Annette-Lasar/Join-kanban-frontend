import { Component, OnInit, HostListener, OnDestroy } from '@angular/core';
import { HeaderComponent } from '../../shared/components/header/header.component';
import { NavbarComponent } from '../../shared/components/navbar/navbar.component';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { Contact } from '../../shared/interfaces/contact.interface';
import { ContactDetailsComponent } from './contact-details/contact-details.component';
import { contacts } from '../../shared/data/contacts.data';
import { ContactService } from '../../shared/services/contact.service';
import { Subscription } from 'rxjs';
import { ContactFormComponent } from './contact-form/contact-form.component';

@Component({
  selector: 'join-contacts',
  standalone: true,
  imports: [
    HeaderComponent,
    NavbarComponent,
    ButtonComponent,
    ContactDetailsComponent,
    ContactFormComponent
  ],
  templateUrl: './contacts.component.html',
  styleUrl: './contacts.component.scss',
})
export class ContactsComponent implements OnInit {
  dummyContacts = contacts;
  groupedContacts: { key: string; value: Contact[] }[] = [];
  isMobile: boolean = false;
  showDetails: boolean = false;
  contactIsActive: boolean = false;
  currentContact: Contact | null = null;
  private subscription: Subscription | null = null;

  constructor(private contactService: ContactService) {}

  ngOnInit(): void {
    this.checkViewport();
    this.groupContacts();
    this.updateShowDetails();
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    this.checkViewport();
  }

  checkViewport() {
    this.isMobile = window.innerWidth < 800;
  }

  groupContacts(): void {
    const groups = this.dummyContacts.reduce((acc, contact) => {
      const lastNameInitial =
        contact.name.split(' ').pop()?.charAt(0).toUpperCase() ?? '';
      if (!acc[lastNameInitial]) {
        acc[lastNameInitial] = [];
      }
      acc[lastNameInitial].push(contact);
      return acc;
    }, {} as { [key: string]: Contact[] });

    this.sortLetters(groups);
  }

  sortLetters(groups: any) {
    this.groupedContacts = Object.keys(groups)
      .sort()
      .map((key) => ({ key, value: groups[key] }));
  }

  updateShowDetails() {
    this.subscription = this.contactService.showDetails$.subscribe((value) => {
      this.showDetails = value;
    });
  }

  showContactDetails(contact: Contact) {
    this.contactService.setShowDetails(true);
    this.currentContact = contact;
    this.contactService.setCurrentContact(contact);
    this.contactIsActive = !this.contactIsActive;
    
  }

  goBackToContactOverview() {
    this.contactService.setShowDetails(false);
  }
}
