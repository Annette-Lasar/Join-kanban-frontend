import {
  Component,
  OnInit,
  Input,
  HostListener,
  OnDestroy,
} from '@angular/core';
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
import { ColorBrightnessService } from '../../shared/services/color-brightness.service';

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
  ],
  templateUrl: './contacts.component.html',
  styleUrl: './contacts.component.scss',
})
export class ContactsComponent implements OnInit {
  dummyContacts = contacts;
  groupedContacts: { key: string; value: Contact[] }[] = [];
  isMobile: boolean = true;
  showDetails: boolean = false;
  contactIsActive: boolean = false;
  contactFormStatus: boolean = false;
  contactDetailFormStatus: boolean = false;
  currentContact: Contact | null = null;
  isAddContactMode: boolean = true;
  colorBrightness: boolean = false;

  private subscription: Subscription | null = null;

  constructor(
    private contactService: ContactService,
    private colorBrightnessService: ColorBrightnessService
  ) {}

  ngOnInit(): void {
    this.checkViewport();
    this.groupContacts();
    this.updateShowDetails();
    this.setColorBrightnessforContact();
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  setColorBrightnessforContact() {
    this.dummyContacts.forEach((contact) => {
      contact.colorBrightness = this.colorBrightnessService.isColorBright(
        contact.contact_color
      );
    });
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

  changeContactFormStatus() {
    this.contactFormStatus = true;
  }

  changeContactDetailFormStatus() {
    this.contactDetailFormStatus = true;
  }

  handleContactFormStatus(newStatus: boolean) {
    if (this.showDetails) {
      this.contactFormStatus = true;
      this.isAddContactMode = newStatus;
    } else {
      this.contactFormStatus = newStatus;
      this.isAddContactMode = true;
    }
  }

  closeContactForm(closeStatus: boolean) {
    this.contactFormStatus = closeStatus;
    this.isAddContactMode = true;
  }

  hideContextMenu() {
    this.contactDetailFormStatus = false;
  }
}
