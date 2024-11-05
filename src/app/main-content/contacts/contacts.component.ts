import { Component, OnInit, HostListener } from '@angular/core';
import { HeaderComponent } from '../../shared/components/header/header.component';
import { NavbarComponent } from '../../shared/components/navbar/navbar.component';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { Contact } from '../../shared/interfaces/contact.interface';
import { ContactDetailsComponent } from './contact-details/contact-details.component';
import { contacts } from '../../shared/data/contacts.data';
import { ContactService } from '../../shared/services/contact.service';
import { Subscription } from 'rxjs';
import { ContactFormComponent } from './contact-form/contact-form.component';
import { ContextMenuComponent } from '../../shared/components/context-menu/context-menu.component';
import { OutsideClickDirective } from '../../shared/directives/outside-click.directive';
import { CommonModule } from '@angular/common';
import { GroupContactsService } from '../../shared/services/group-contacts.service';
import { InfoComponent } from '../../shared/components/info/info.component';
import { ContactStatusService } from '../../shared/services/contact-status.service';

@Component({
  selector: 'join-contacts',
  standalone: true,
  imports: [
    CommonModule,
    HeaderComponent,
    NavbarComponent,
    ButtonComponent,
    ContactDetailsComponent,
    ContactFormComponent,
    ContextMenuComponent,
    OutsideClickDirective,
    InfoComponent,
  ],
  templateUrl: './contacts.component.html',
  styleUrl: './contacts.component.scss',
})
export class ContactsComponent implements OnInit {
  dummyContacts: Contact[] | null = contacts;
  groupedContacts: { key: string; value: Contact[] }[] = [];

  isMobile: boolean = true;
  showDetails: boolean = false;
  contactIsActive: boolean = false;
  contactFormStatus: boolean = false;
  contactDetailFormStatus: boolean = false;
  deleteContactStatus: boolean = false;
  successStatus: boolean = false;
  currentContact: Contact | null = null;
  isAddContactMode: boolean = true;
  colorBrightness: boolean = false;

  private subscription: Subscription | null = null;

  constructor(
    private contactService: ContactService,
    private groupContactsService: GroupContactsService,
    private contactStatusService: ContactStatusService
  ) {}

  ngOnInit(): void {
    this.checkViewport();
    this.initializeContactsValue();
    this.updateContactsList();
    this.groupContacts();
    this.getGroupedContacts();
    this.updateShowDetails();
    this.getUpdatedShowDetailsStatus();
    this.getUpdatedContactFormStatus();
    this.getUpdatedIsAddContactModeStatus();
    this.updateDeleteContactStatus();
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

  initializeContactsValue(): void {
    if (this.dummyContacts) {
      this.contactService.initializeContacts(this.dummyContacts);
    }
  }

  updateContactsList(): void {
    this.contactService.contacts$.subscribe((updatedContacts) => {
      this.dummyContacts = [...updatedContacts];
    });
  }

  setNewContactFormStatus(newStatus: boolean): void {
    this.contactStatusService.setContactFormStatus(newStatus);
    this.getUpdatedContactFormStatus();
  }

  getUpdatedContactFormStatus(): void {
    this.contactStatusService.contactFormStatus$.subscribe((status) => {
      this.contactFormStatus = status;
    })
  }

  getUpdatedShowDetailsStatus(): void {
    this.contactStatusService.showDetailsStatus$.subscribe((status) => {
      this.showDetails = status;
    })
  }

  getUpdatedIsAddContactModeStatus(): void {
    this.contactStatusService.isAddContactModeStatus$.subscribe((status) => {
      this.isAddContactMode = status;
    })
  }

  setNewIsAddContactModeStatus(newStatus: boolean): void {
    this.contactStatusService.setIsAddContactModeStatus(newStatus);
  }

  updateDeleteContactStatus() {
    this.contactStatusService.deleteContactStatus$.subscribe((status) => {
      this.deleteContactStatus = status;
    });
  }

  groupContacts() {
    this.groupContactsService.groupContactsAlphabetically(this.dummyContacts);
  }

  getGroupedContacts() {
    this.groupContactsService.groupContactsSubject$.subscribe((groups) => {
      this.groupedContacts = this.sortLetters(groups);
    });
  }

  sortLetters(groups: any) {
    return Object.keys(groups)
      .sort()
      .map((key) => ({ key, value: groups[key] }));
  }

  updateShowDetails() {
    this.subscription = this.contactStatusService.showDetailsStatus$.subscribe((value) => {
      this.showDetails = value;
    });
  }

  showContactDetails(contact: Contact) {
    // this.contactService.setShowDetails(true);
    this.contactStatusService.setShowDetailsStatus(true);
    this.contactStatusService.setIsAddContactModeStatus(false);
    this.currentContact = contact;
    this.contactService.setCurrentContact(contact);
    this.contactIsActive = true;
  }

/*   goBackToContactOverview() {
    this.contactStatusService.setShowDetailsStatus(false);
  } */

/*   changeContactFormStatus() {
    this.contactFormStatus = true;
  } */

    changeContactFormStatus() {
      this.setNewContactFormStatus(true);
      this.getUpdatedContactFormStatus();
    }

  changeContactDetailFormStatus() {
    this.contactDetailFormStatus = true;
  }

    handleContactFormStatus(newStatus: boolean) {
      if (this.showDetails) {
        this.setNewContactFormStatus(true);
        // this.isAddContactMode = newStatus;
        this.setNewIsAddContactModeStatus(newStatus);
      } else {
        this.setNewContactFormStatus(newStatus);
        // this.isAddContactMode = true;
        this.setNewIsAddContactModeStatus(true);
      }
      this.getUpdatedContactFormStatus();
    }

  closeContactForm(closeStatus: boolean) {
    this.contactFormStatus = closeStatus;
    // this.isAddContactMode = true;
    this.setNewIsAddContactModeStatus(true);
  }

  hideContextMenu() {
    this.contactDetailFormStatus = false;
  }

/*   deleteContactFromList() {
    let currentContactIndex = this.dummyContacts?.findIndex((oneContact) => {
      return this.currentContact
        ? oneContact.name === this.currentContact.name
        : false;
    });

    if (currentContactIndex) {
      this.dummyContacts?.splice(currentContactIndex, 1);
    }
    console.log('Kontakt', this.currentContact?.name, 'gelöscht.');
    console.log('Kontakte: ', this.dummyContacts);
    this.updateContactsList();
    this.updateShowDetails();
  } */

  setSuccessStatus(newStatus: boolean) {
    this.successStatus = newStatus;
    setTimeout(() => {
      this.successStatus = false;
    }, 3000);
  }

  setSecurityInfoStatus(newStatus: boolean) {
    this.deleteContactStatus = newStatus;
    console.log('neuer Status: ', this.deleteContactStatus);

  }

  setDeleteContactStatus(newStatus: boolean) {
    this.deleteContactStatus = newStatus;
  }
}
