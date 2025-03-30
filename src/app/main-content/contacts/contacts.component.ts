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
import { ActionService } from '../../shared/services/action.service';
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
    private actionService: ActionService,
    private infoBoxService: InfoBoxService
  ) {}

  ngOnInit(): void {
    this.loadContacts();
    this.checkViewport();
    this.subscribeToCurrentContactSubject();
    this.getGroupedContacts();
    this.updateShowDetails();
    this.getUpdatedShowDetailsStatus();
    this.getContactFormState();
    this.getUpdatedDetailFormStatus();
    this.getUpdatedInfoBoxStatus();
    this.subscribeToDeleteContact();
  }

  ngOnDestroy(): void {
    this.subscriptions?.unsubscribe();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    this.checkViewport();
  }

  checkViewport() {
    this.isMobile = window.innerWidth < 1024;
  }

  loadContacts(): void {
    const subscription = this.contactService
      .fetchData()
      .pipe(switchMap(() => this.contactService.contacts$))
      .subscribe({
        next: (contacts) => {
          this.contacts = contacts;
          this.groupContacts();
        },
        error: (err) => console.error('Fehler beim Laden der Kontakte:', err),
      });
    this.subscriptions?.add(subscription);
  }

  getContactFormState(): void {
    const subscription = this.contactStatusService.contactFormStatus$.subscribe(
      (state) => {
        this.contactFormStatus = state.visible;
        this.isAddContactMode = state.mode === 'add';
      }
    );
    this.subscriptions?.add(subscription);
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
    const subscription = this.contactStatusService.showDetailsStatus$.subscribe(
      (status) => {
        this.showDetails = status;
      }
    );
    this.subscriptions?.add(subscription);
  }

  getUpdatedDetailFormStatus(): void {
    const subscription =
      this.contactStatusService.contactDetailFormStatus$.subscribe((status) => {
        this.contactDetailFormStatus = status;
      });
    this.subscriptions?.add(subscription);
  }

  getUpdatedInfoBoxStatus() {
    const subscription = this.infoBoxService.infoBoxStatus$.subscribe(
      (status) => {
        this.infoBoxStatus = status;
      }
    );
    this.subscriptions?.add(subscription);
  }

  groupContacts() {
    this.groupContactsService.groupContactsAlphabetically(this.contacts);
  }

  getGroupedContacts() {
    const subscription =
      this.groupContactsService.groupContactsSubject$.subscribe((groups) => {
        this.groupedContacts = this.sortLetters(groups);
      });
    this.subscriptions?.add(subscription);
  }

  sortLetters(groups: any) {
    return Object.keys(groups)
      .sort()
      .map((key) => ({ key, value: groups[key] }));
  }

  updateShowDetails() {
    const subscription = this.contactStatusService.showDetailsStatus$.subscribe(
      (value) => {
        this.showDetails = value;
      }
    );
    this.subscriptions?.add(subscription);
  }

  showContactDetails(contact: Contact) {
    this.contactStatusService.setShowDetailsStatus(true);
    this.currentContact = contact;
    this.contactService.setCurrentContact(contact);
    this.contactIsActive = true;
  }

  hideContextMenu() {
    this.contactStatusService.setContactDetailFormStatus(false);
  }

  subscribeToDeleteContact(): void {
    const subscription = this.actionService.deleteContactEvent.subscribe(() => {
      const contactId: number | undefined = this.currentContact?.id;
      if (contactId === undefined) return;
      this.sendDeletedContactToServer(contactId);
    });
    this.subscriptions?.add(subscription);
  }

  sendDeletedContactToServer(contactId: number): void {
    const subscription = this.contactService.deleteData(contactId).subscribe({
      next: () => {
        this.groupContactsService.groupContactsAlphabetically(this.contacts);
        this.contactService.setCurrentContact(null); // Detailansicht zurücksetzen
        this.contactStatusService.setShowDetailsStatus(false); // Detailansicht schließen
        this.actionService.handleInfoContainers({
          infoText: 'Contact successfully deleted!',
          isVisible: true,
          persistent: false,
        });
      },
      error: (err) => {
        console.error('Fehler beim Löschen des Kontakts:', err);
        this.actionService.handleInfoContainers({
          infoText: 'Error: Could not delete contact.',
          isVisible: true,
          persistent: false,
        });
      },
    });
    this.subscriptions?.add(subscription);
  }

  setSuccessStatus(newStatus: boolean) {
    this.successStatus = newStatus;
    setTimeout(() => {
      this.successStatus = false;
    }, 3000);
  }

  setSecurityInfoStatus(newStatus: boolean) {
    this.infoBoxStatus = newStatus;
  }
}
