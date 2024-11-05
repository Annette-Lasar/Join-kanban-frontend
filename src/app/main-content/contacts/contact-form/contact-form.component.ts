/* import {
  Component,
  OnInit,
  HostListener,
  Input,
  Output,
  EventEmitter,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { FormsModule, NgForm } from '@angular/forms';
import { Contact } from '../../../shared/interfaces/contact.interface';
import { RandomColorService } from '../../../shared/services/random-color.service';
import { ColorBrightnessService } from '../../../shared/services/color-brightness.service';
import { ContactService } from '../../../shared/services/contact.service';
import { GroupContactsService } from '../../../shared/services/group-contacts.service';
import { ValidatateInputFieldsService } from '../../../shared/services/validateInputFields.service';
import { EVENT_MANAGER_PLUGINS } from '@angular/platform-browser';
import { ContactStatusService } from '../../../shared/services/contact-status.service';


@Component({
  selector: 'join-contact-form',
  standalone: true,
  imports: [ButtonComponent, CommonModule, FormsModule],
  templateUrl: './contact-form.component.html',
  styleUrl: './contact-form.component.scss',
})
export class ContactFormComponent implements OnInit {
  isMobile: boolean = true;
  isInputName: boolean = false;
  newContact: Contact = {
    id: '',
    name: '',
    email: '',
    phone: '',
    contact_color: '',
    color_brightness: false,
  };

  @Input() contacts: Contact[] | null = null;
  @Input() currentContact: Contact | null = null;
  @Input() isAddContactMode: boolean = true;
  @Input() contactFormStatus: boolean = false;
  @Input() detailStatus: boolean = false;
  @Output() newContactFormStatus = new EventEmitter<boolean>();
  @Output() closeContactFormStatus = new EventEmitter<boolean>();
  @Output() addContactSuccessful = new EventEmitter<boolean>();

  @ViewChild('contactForm') contactForm!: NgForm;

  constructor(
    private contactService: ContactService,
    private contactStatusService: ContactStatusService,
    private groupContactsService: GroupContactsService,
    private randomColorService: RandomColorService,
    private colorBrightnessService: ColorBrightnessService,
    private validatateInputFieldsService: ValidatateInputFieldsService
  ) {}

  ngOnInit(): void {
    this.checkViewport();
   this.updateContactList();
   this.updateContactStatus();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    this.checkViewport();
  }

  checkViewport() {
    this.isMobile = window.innerWidth < 800;
  }

  updateContactList() {
    this.contactService.currentContact$.subscribe((contact) => {
      if (contact) {
        this.newContact = { ...contact };
      }
    });
  }

  updateContactStatus() {
    this.contactStatusService.contactFormStatus$.subscribe((status) => {
      this.contactFormStatus = status;
    });
  }

  closeContactForm() {
    this.contactFormStatus = false;
    this.isAddContactMode = true;
    this.closeContactFormStatus.emit(this.contactFormStatus);
  }

  inputIsValid(inputType: string): boolean {
    let validationResult = false;
    if (inputType === 'name') {
      validationResult = this.validatateInputFieldsService.checkIfNameIsValid(
        this.newContact.name
      );
    } else if (inputType === 'email') {
      validationResult = this.validatateInputFieldsService.checkIfEmailIsValid(
        this.newContact.email
      );
    } else {
      validationResult = this.validatateInputFieldsService.checkIfPhoneIsValid(
        this.newContact.phone
      );
    }
    return validationResult;
  }

  onSubmit() {
    const nameIsValid = this.newContact.name && this.inputIsValid('name');
    const emailIsValid = !this.newContact.email || this.inputIsValid('email');
    const phoneIsValid = !this.newContact.phone || this.inputIsValid('phone');
    if (nameIsValid && emailIsValid && phoneIsValid) {
      this.setRandomColorForContact();
      this.addNewContactToList();
      this.groupContactsService.groupContactsAlphabetically(this.contacts);
      this.clearInputFields();
      this.closeContactFormStatus.emit(false);
    } else {
      console.log('Bitte fülle alle Felder korrekt aus.');
    }
  }

  setRandomColorForContact() {
    this.newContact.contact_color = this.randomColorService.getRandomColor();
    this.newContact.color_brightness =
      this.colorBrightnessService.isColorBright(this.newContact.contact_color);
  }

  addNewContactToList() {
    this.contactService.addContact(this.newContact);
    this.contactService.contacts$.subscribe((contacts) => {
      this.contacts = contacts;
    });
  }

  resetForm() {
    this.newContact = {
      id: '',
      name: '',
      email: '',
      phone: '',
      contact_color: '',
      color_brightness: false,
    };
  }

  clearInputFields(form?: NgForm) {
    if (form && this.isAddContactMode) {
      form.resetForm();
    } else if (this.contactForm && this.isAddContactMode) {
      this.contactForm.controls['name'].markAsPristine();
      this.contactForm.controls['name'].markAsUntouched();
    }
    if (this.isAddContactMode) {
      this.resetForm();
    }
  }

  isContactSuccessfullyAdded() {
    this.addContactSuccessful.emit(true);
  }
} */

import {
  Component,
  OnInit,
  HostListener,
  Input,
  Output,
  EventEmitter,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { FormsModule, NgForm } from '@angular/forms';
import { Contact } from '../../../shared/interfaces/contact.interface';
import { RandomColorService } from '../../../shared/services/random-color.service';
import { ColorBrightnessService } from '../../../shared/services/color-brightness.service';
import { ContactService } from '../../../shared/services/contact.service';
import { GroupContactsService } from '../../../shared/services/group-contacts.service';
import { ValidatateInputFieldsService } from '../../../shared/services/validateInputFields.service';
import { EVENT_MANAGER_PLUGINS } from '@angular/platform-browser';
import { ContactStatusService } from '../../../shared/services/contact-status.service';

@Component({
  selector: 'join-contact-form',
  standalone: true,
  imports: [ButtonComponent, CommonModule, FormsModule],
  templateUrl: './contact-form.component.html',
  styleUrl: './contact-form.component.scss',
})
export class ContactFormComponent implements OnInit {
  isMobile: boolean = true;
  isInputName: boolean = false;
  newContact: Contact = {
    id: '',
    name: '',
    email: '',
    phone: '',
    contact_color: '',
    color_brightness: false,
  };

  @Input() contacts: Contact[] | null = null;
  @Input() currentContact: Contact | null = null;
  @Input() isAddContactMode: boolean = true;
  @Input() contactFormStatus: boolean = false;
  @Input() detailStatus: boolean = false;
  @Output() newContactFormStatus = new EventEmitter<boolean>();
  @Output() closeContactFormStatus = new EventEmitter<boolean>();
  @Output() addContactSuccessful = new EventEmitter<boolean>();

  @ViewChild('contactForm') contactForm!: NgForm;

  constructor(
    private contactService: ContactService,
    private contactStatusService: ContactStatusService,
    private groupContactsService: GroupContactsService,
    private randomColorService: RandomColorService,
    private colorBrightnessService: ColorBrightnessService,
    private validatateInputFieldsService: ValidatateInputFieldsService
  ) {}

  ngOnInit(): void {
    this.checkViewport();
    this.updateContactList();
    this.getUpdatedContactFormStatus();
    this.getUpdatedIsContactModeStatus();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event): void {
    this.checkViewport();
  }

  checkViewport(): void {
    this.isMobile = window.innerWidth < 800;
  }

  updateContactList(): void {
    this.contactService.currentContact$.subscribe((contact) => {
      if (contact) {
        this.newContact = { ...contact };
      }
    });
  }

  getUpdatedContactFormStatus(): void {
    this.contactStatusService.contactFormStatus$.subscribe((status) => {
      this.contactFormStatus = status;
    });
  }

  getUpdatedIsContactModeStatus(): void {
    this.contactStatusService.isAddContactModeStatus$.subscribe((status) => {
      this.isAddContactMode = status;
    });
  }

  setNewIsAddContactModeStatus(newStatus: boolean): void {
    this.contactStatusService.setIsAddContactModeStatus(newStatus);
  }

  closeContactForm(): void {
    this.contactFormStatus = false;
    // this.isAddContactMode = true;
    this.setNewIsAddContactModeStatus(true);
    this.closeContactFormStatus.emit(this.contactFormStatus);
  }

  inputIsValid(inputType: string): boolean {
    let validationResult = false;
    if (inputType === 'name') {
      validationResult = this.validatateInputFieldsService.checkIfNameIsValid(
        this.newContact.name
      );
    } else if (inputType === 'email') {
      validationResult = this.validatateInputFieldsService.checkIfEmailIsValid(
        this.newContact.email
      );
    } else {
      validationResult = this.validatateInputFieldsService.checkIfPhoneIsValid(
        this.newContact.phone
      );
    }
    return validationResult;
  }

  onSubmit() {
    const nameIsValid = this.newContact.name && this.inputIsValid('name');
    const emailIsValid = !this.newContact.email || this.inputIsValid('email');
    const phoneIsValid = !this.newContact.phone || this.inputIsValid('phone');
    if (nameIsValid && emailIsValid && phoneIsValid) {
      this.setRandomColorForContact();
      this.addNewContactToList();
      this.groupContactsService.groupContactsAlphabetically(this.contacts);
      this.clearInputFields();
      this.closeContactFormStatus.emit(false);
    } else {
      console.log('Bitte fülle alle Felder korrekt aus.');
    }
  }

  setRandomColorForContact() {
    this.newContact.contact_color = this.randomColorService.getRandomColor();
    this.newContact.color_brightness =
      this.colorBrightnessService.isColorBright(this.newContact.contact_color);
  }

  addNewContactToList() {
    this.contactService.addContact(this.newContact);
    this.contactService.contacts$.subscribe((contacts) => {
      this.contacts = contacts;
    });
  }

  resetForm() {
    this.newContact = {
      id: '',
      name: '',
      email: '',
      phone: '',
      contact_color: '',
      color_brightness: false,
    };
  }

  clearInputFields(form?: NgForm) {
    if (form && this.isAddContactMode) {
      form.resetForm();
    } else if (this.contactForm && this.isAddContactMode) {
      this.contactForm.controls['name'].markAsPristine();
      this.contactForm.controls['name'].markAsUntouched();
    }
    if (this.isAddContactMode) {
      this.resetForm();
    }
  }

  isContactSuccessfullyAdded() {
    this.addContactSuccessful.emit(true);
  }
}
