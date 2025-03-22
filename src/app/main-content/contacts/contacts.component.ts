import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { Contact } from '../../shared/interfaces/contact.interface';
import { ContactDetailsComponent } from './contact-details/contact-details.component';
import { ContactService } from '../../shared/services/contact.service';
import { ContactFormComponent } from './contact-form/contact-form.component';
import { ContextMenuComponent } from '../../shared/components/context-menu/context-menu.component';
import { OutsideClickDirective } from '../../shared/directives/outside-click.directive';
import { CommonModule } from '@angular/common';
import { GroupContactsService } from '../../shared/services/group-contacts.service';
import { ContactStatusService } from '../../shared/services/contact-status.service';
import { ButtonPropertyService } from '../../shared/services/button-propertys.service';
import { InfoBoxService } from '../../shared/services/info-box.service';
import { switchMap, Subscription } from 'rxjs';

@Component({
  selector: 'join-contacts',
  standalone: true,
  imports: [
    CommonModule,
    ButtonComponent,
    ContactDetailsComponent,
    ContactFormComponent,
    ContextMenuComponent,
    OutsideClickDirective,
  ],
  templateUrl: './contacts.component.html',
  styleUrl: './contacts.component.scss',
})
export class ContactsComponent implements OnInit, OnDestroy {
  contacts: Contact[] = [];
  groupedContacts: { key: string; value: Contact[] }[] = [];

  isMobile: boolean = true;
  showDetails: boolean = false;
  contactIsActive: boolean = false;
  contactFormStatus: boolean = false;
  contactDetailFormStatus: boolean = false;
  infoBoxStatus: boolean = false;
  deleteContactStatus: boolean = false;
  successStatus: boolean = false;
  currentContact: Contact | null = null;
  isAddContactMode: boolean = true;
  colorBrightness: boolean = false;
  isInitialLoad: boolean = true;

  private subscriptions: Subscription | null = null;

  constructor(
    private contactService: ContactService,
    private groupContactsService: GroupContactsService,
    private contactStatusService: ContactStatusService,
    private buttonPropertyService: ButtonPropertyService,
    private infoBoxService: InfoBoxService,
  ) {}

  ngOnInit(): void {
    this.loadContacts();
    this.checkViewport();
    this.subscribeToCurrentContactSubject();
    // this.initializeContactsValue();
    // this.updateContactsList();
    // this.groupContacts();
    this.getGroupedContacts();
    this.updateShowDetails();
    this.getUpdatedShowDetailsStatus();
    this.getUpdatedContactFormStatus();
    this.getUpdatedIsAddContactModeStatus();
    // this.getUpdatedDeleteContactStatus();
    this.getUpdatedDetailFormStatus();
    this.getUpdatedButtonPropertyStatus();
    this.getUpdatedSuccessStatus();
    this.getUpdatedInfoBoxStatus();
  }

  ngOnDestroy(): void {
    this.subscriptions?.unsubscribe();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    this.checkViewport();
  }

  checkViewport() {
    this.isMobile = window.innerWidth < 800;
  }

  loadContacts(): void {
    const subscription = this.contactService
      .fetchData()
      .pipe(switchMap(() => this.contactService.contacts$))
      .subscribe({
        next: (contacts) => {
          this.contacts = contacts;
          this.groupContacts();
          console.log('Kontakte auf dem Board:', this.contacts);
        },
        error: (err) => console.error('Fehler beim Laden der Kontakte:', err),
      });
    this.subscriptions?.add(subscription);
  }

  setNewContactFormStatus(newStatus: boolean): void {
    this.contactStatusService.setContactFormStatus(newStatus);
    this.getUpdatedContactFormStatus();
  }

  getUpdatedContactFormStatus(): void {
    this.contactStatusService.contactFormStatus$.subscribe((status) => {
      this.contactFormStatus = status;
    });
  }

  subscribeToCurrentContactSubject(): void {
    const subscription = this.contactService.currentContact$.subscribe(
      (contact) => {
        this.currentContact = contact;
      }
    );
    this.subscriptions?.add(subscription);
  }

  getUpdatedShowDetailsStatus(): void {
    this.contactStatusService.showDetailsStatus$.subscribe((status) => {
      this.showDetails = status;
    });
  }

  getUpdatedIsAddContactModeStatus(): void {
    this.contactStatusService.isAddContactModeStatus$.subscribe((status) => {
      this.isAddContactMode = status;
    });
  }

  getUpdatedDetailFormStatus(): void {
    this.contactStatusService.contactDetailFormStatus$.subscribe((status) => {
      this.contactDetailFormStatus = status;
    });
  }

  getUpdatedButtonPropertyStatus(): void {
    this.buttonPropertyService.isAddContactButtonClicked$.subscribe(
      (status) => {
        this.contactStatusService.setContactFormStatus(status);
      }
    );
  }

  getUpdatedSuccessStatus() {
    this.contactStatusService.contactSuccessStatus$.subscribe((status) => {
      this.successStatus = status;
    });
  }

  getUpdatedInfoBoxStatus() {
    this.infoBoxService.infoBoxStatus$.subscribe((status) => {
      this.infoBoxStatus = status;
    });
  }

  setNewIsAddContactModeStatus(newStatus: boolean): void {
    this.contactStatusService.setIsAddContactModeStatus(newStatus);
  }

  /*   getUpdatedDeleteContactStatus() {
    this.contactStatusService.deleteContactStatus$.subscribe((status) => {
      if (!this.isInitialLoad && status) {
        this.deleteContactStatus = status;
        this.deleteContactFromList();
      }
      this.isInitialLoad = false;
    });
  } */

  groupContacts() {
    this.groupContactsService.groupContactsAlphabetically(this.contacts);
  }

  getGroupedContacts() {
    this.groupContactsService.groupContactsSubject$.subscribe((groups) => {
      // console.log('Gruppierte Kontakte: ', this.groupedContacts);
      this.groupedContacts = this.sortLetters(groups);
    });
  }

  sortLetters(groups: any) {
    return Object.keys(groups)
      .sort()
      .map((key) => ({ key, value: groups[key] }));
  }

  updateShowDetails() {
    this.subscriptions = this.contactStatusService.showDetailsStatus$.subscribe(
      (value) => {
        this.showDetails = value;
      }
    );
  }

  showContactDetails(contact: Contact) {
    this.contactStatusService.setShowDetailsStatus(true);
    this.contactStatusService.setIsAddContactModeStatus(false);
    this.currentContact = contact;
    this.contactService.setCurrentContact(contact);
    this.contactIsActive = true;
  }

  changeContactFormStatus() {
    this.setNewContactFormStatus(true);
    this.getUpdatedContactFormStatus();
  }

  hideContextMenu() {
    this.contactStatusService.setContactDetailFormStatus(false);
  }

  /* deleteContactFromList() {
    console.log('Kontakte: ', this.dummyContacts);
    let currentContactIndex = this.dummyContacts?.findIndex((oneContact) => {
      return this.currentContact
        ? oneContact.name === this.currentContact.name
        : false;
    });
    console.log('currentContactIndex: ', currentContactIndex);
    if (currentContactIndex !== undefined && currentContactIndex !== -1) {
      console.log('Ich werde ausgeführt.');
      this.dummyContacts?.splice(currentContactIndex, 1);
      console.log('Kontakt', this.currentContact?.name, 'gelöscht.');
      console.log('Kontakte: ', this.dummyContacts);
    }
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
    this.infoBoxStatus = newStatus;
    console.log('neuer Status: ', this.infoBoxStatus);
  }
}
