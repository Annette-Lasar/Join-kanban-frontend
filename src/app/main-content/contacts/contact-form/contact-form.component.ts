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
import { ContactStatusService } from '../../../shared/services/contact-status.service';
import { ButtonPropertyService } from '../../../shared/services/button-propertys.service';

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
  isCreateContactClicked: boolean = false;
  isClearInputFieldClicked: boolean = false;
  isAddContactMode: boolean = true;
  contactFormStatus: boolean = false;
  isInitialLoad: boolean = true;

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
  @Input() detailStatus: boolean = false;

  @ViewChild('contactForm') contactForm!: NgForm;

  constructor(
    private contactService: ContactService,
    private contactStatusService: ContactStatusService,
    private groupContactsService: GroupContactsService,
    private randomColorService: RandomColorService,
    private colorBrightnessService: ColorBrightnessService,
    private validatateInputFieldsService: ValidatateInputFieldsService,
    private buttonPropertyService: ButtonPropertyService
  ) {}

  ngOnInit(): void {
    this.checkViewport();
    this.updateContactList();
    this.getUpdatedContactFormStatus();
    this.getUpdatedIsContactModeStatus();
    this.getUpdatedIsCreateContactClicked();
    this.getUpdatedIsClearInputFieldClicked();
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

  getUpdatedIsCreateContactClicked(): void {
    this.buttonPropertyService.createNewContactClicked$.subscribe((status) => {
      if (!this.isInitialLoad && status) {
        this.onSubmit();
      }
      this.isInitialLoad = false;
    });
  }

  getUpdatedIsClearInputFieldClicked(): void {
    this.buttonPropertyService.clearInputButtonClicked$.subscribe((status) => {
      this.isClearInputFieldClicked = status;
      this.clearInputFields();
    });
  }

  setNewIsAddContactModeStatus(newStatus: boolean): void {
    this.contactStatusService.setIsAddContactModeStatus(newStatus);
  }

  closeContactForm(): void {
    this.contactStatusService.setContactFormStatus(false);
    this.setNewIsAddContactModeStatus(true);
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
    console.log('Ich werde aufgerufen!');
    const nameIsValid = this.newContact.name && this.inputIsValid('name');
    const emailIsValid = !this.newContact.email || this.inputIsValid('email');
    const phoneIsValid = !this.newContact.phone || this.inputIsValid('phone');
    console.log('neuer Kontakt: ', this.newContact);
    if (nameIsValid && emailIsValid && phoneIsValid) {
      this.setRandomColorForContact();
      this.addNewContactToList();
      this.groupContactsService.groupContactsAlphabetically(this.contacts);
      this.clearInputFields();
      this.contactStatusService.setContactFormStatus(false);
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
    this.contactStatusService.setSuccessStatus(true);
  }
} */

import {
  Component,
  OnInit,
  HostListener,
  Input,
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
import { ContactStatusService } from '../../../shared/services/contact-status.service';
import { ButtonPropertyService } from '../../../shared/services/button-propertys.service';

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
  isCreateContactClicked: boolean = false;
  isClearInputFieldClicked: boolean = false;
  isAddContactMode: boolean = true;
  contactFormStatus: boolean = false;
  detailStatus: boolean = false;
  isInitialLoad: boolean = true;
  nameIsValid: boolean = false;
  emailIsValid: boolean = true;
  phoneIsValid: boolean = true;

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
  // @Input() detailStatus: boolean = false;

  @ViewChild('contactForm') contactForm!: NgForm;

  constructor(
    private contactService: ContactService,
    private contactStatusService: ContactStatusService,
    private groupContactsService: GroupContactsService,
    private randomColorService: RandomColorService,
    private colorBrightnessService: ColorBrightnessService,
    private validateInputFieldsService: ValidatateInputFieldsService,
    private buttonPropertyService: ButtonPropertyService
  ) {}

  ngOnInit(): void {
    this.checkViewport();
    this.updateContactList();
    this.getUpdatedContactFormStatus();
    this.getUpdatedDetailStatus();
    this.getUpdatedIsContactModeStatus();
    this.getUpdatedIsCreateContactClicked();
    this.getUpdatedIsClearInputFieldClicked();
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

  getUpdatedDetailStatus(): void {
    this.contactStatusService.showDetailsStatus$.subscribe((status) => {
      this.detailStatus = status;
    });
  }

  getUpdatedIsContactModeStatus(): void {
    this.contactStatusService.isAddContactModeStatus$.subscribe((status) => {
      this.isAddContactMode = status;
    });
  }

  getUpdatedIsCreateContactClicked(): void {
    this.buttonPropertyService.createNewContactClicked$.subscribe((status) => {
      if (!this.isInitialLoad && status) {
        this.onSubmit();
      }
      this.isInitialLoad = false;
    });
  }

  getUpdatedIsClearInputFieldClicked(): void {
    this.buttonPropertyService.clearInputButtonClicked$.subscribe((status) => {
      this.isClearInputFieldClicked = status;
      this.clearInputFields();
    });
  }

  setNewIsAddContactModeStatus(newStatus: boolean): void {
    this.contactStatusService.setIsAddContactModeStatus(newStatus);
  }

  closeContactForm(): void {
    this.contactStatusService.setContactFormStatus(false);
    if (this.contactStatusService.getAddContactModeStatus()) {
      this.setNewIsAddContactModeStatus(true);
    }
    this.setNewIsAddContactModeStatus(false);
  }

  validateName(email: string) {
    this.validateInputFieldsService
      .checkIfNameIsValid(email)
      .subscribe((isValid) => {
        this.nameIsValid = isValid;
      });
  }

  validateEmail(email: string) {
    this.validateInputFieldsService
      .checkIfEmailIsValid(email)
      .subscribe((isValid) => {
        this.emailIsValid = isValid;
      });
  }

  validatePhone(phone: string): void {
    this.validateInputFieldsService
      .checkIfPhoneIsValid(phone)
      .subscribe((isValid) => {
        this.phoneIsValid = isValid;
      });
  }

  onSubmit(): void {
    if (this.nameIsValid && this.emailIsValid && this.phoneIsValid) {
      this.setRandomColorForContact();
      this.addNewContactToList();
      this.groupContactsService.groupContactsAlphabetically(this.contacts);
      this.clearInputFields();
      this.contactStatusService.setContactFormStatus(false);
      this.contactStatusService.setSuccessStatus(true);
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
}
