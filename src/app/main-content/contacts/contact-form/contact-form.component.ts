import {
  Component,
  OnInit,
  OnChanges,
  OnDestroy,
  HostListener,
  Input,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { FormsModule, NgForm } from '@angular/forms';
import { Contact } from '../../../shared/interfaces/contact.interface';
import { User } from '../../../shared/interfaces/user.interface';
import { RandomColorService } from '../../../shared/services/random-color.service';
import { ColorBrightnessService } from '../../../shared/services/color-brightness.service';
import { ContactService } from '../../../shared/services/contact.service';
import { GroupContactsService } from '../../../shared/services/group-contacts.service';
import { ValidateInputFieldsService } from '../../../shared/services/validateInputFields.service';
import { ContactStatusService } from '../../../shared/services/contact-status.service';
import { ButtonPropertyService } from '../../../shared/services/button-propertys.service';
import { LocalStorageService } from '../../../shared/services/local-storage.service';
import { ActionService } from '../../../shared/services/action.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'join-contact-form',
  standalone: true,
  imports: [ButtonComponent, CommonModule, FormsModule],
  templateUrl: './contact-form.component.html',
  styleUrl: './contact-form.component.scss',
})
export class ContactFormComponent implements OnInit, OnChanges, OnDestroy {
  @Input() contacts: Contact[] | null = null;
  @Input() currentContact: Contact | null = null;
  @Input() currentUser: User | null =
    this.localStorageService.getWholeUserObjectFromLocalStorage();
  @ViewChild('contactForm') contactForm!: NgForm;

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
  showAnimation = true;

  newContact: Omit<Contact, 'id'> = {
    name: '',
    email: '',
    phone_number: '',
    color: '',
    color_brightness: false,
    created_by: null,
  };

  private subscriptions: Subscription = new Subscription();

  constructor(
    private contactService: ContactService,
    private contactStatusService: ContactStatusService,
    private groupContactsService: GroupContactsService,
    private randomColorService: RandomColorService,
    private colorBrightnessService: ColorBrightnessService,
    private buttonPropertyService: ButtonPropertyService,
    private localStorageService: LocalStorageService,
    private actionService: ActionService,
    private validateInputFieldsService: ValidateInputFieldsService
  ) {}

  ngOnInit(): void {
    this.checkViewport();
    this.updateContactList();
    this.getContactFormStatus();
    this.getUpdatedDetailStatus();
    this.getUpdatedIsCreateContactClicked();
    this.getUpdatedIsClearInputFieldClicked();
    this.subscribeToCloseContactFormEvent();
    this.subscribeToValidNameField();
    this.subscribeToValidEmailField();
  }

  ngOnChanges(): void {
    this.prepareFormMode();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event): void {
    this.checkViewport();
  }

  prepareFormMode(): void {
    if (this.isAddContactMode) {
      this.newContact = {
        name: '',
        email: '',
        phone_number: '',
        color: '',
        color_brightness: false,
        created_by: this.currentUser?.id ?? 4,
      };
    } else if (this.currentContact) {
      this.newContact = {
        ...this.currentContact,
      };
    }
  }

  checkViewport(): void {
    this.isMobile = window.innerWidth < 1024;
  }

  /*   updateContactList(): void {
    const subscription = this.contactService.currentContact$.subscribe(
      (contact) => {
        if (contact) {
          this.newContact = { ...contact };
        }
      }
    );
    this.subscriptions.add(subscription);
  } */

  updateContactList(): void {
    const subscription = this.contactService.currentContact$.subscribe(
      (contact) => {
        if (contact && !this.isAddContactMode) {
          this.newContact = { ...contact };
        }
      }
    );
    this.subscriptions.add(subscription);
  }

  getContactFormStatus(): void {
    const subscription = this.contactStatusService.contactFormStatus$.subscribe(
      (state) => {
        // this.contactFormStatus = state.visible;
        this.isAddContactMode = state.mode === 'add';
        this.prepareFormMode();
      }
    );
    this.subscriptions.add(subscription);
  }

  getUpdatedDetailStatus(): void {
    const subscription = this.contactStatusService.showDetailsStatus$.subscribe(
      (status) => {
        this.detailStatus = status;
      }
    );
    this.subscriptions.add(subscription);
  }

  getUpdatedIsCreateContactClicked(): void {
    const subscription =
      this.buttonPropertyService.createNewContactClicked$.subscribe(
        (status) => {
          if (!this.isInitialLoad && status) {
            this.onSubmit();
          }
          this.isInitialLoad = false;
        }
      );
    this.subscriptions.add(subscription);
  }

  getUpdatedIsClearInputFieldClicked(): void {
    const subscription =
      this.buttonPropertyService.clearInputButtonClicked$.subscribe(
        (status) => {
          this.isClearInputFieldClicked = status;
          this.clearInputFields();
        }
      );
    this.subscriptions.add(subscription);
  }

  validateName(name: string) {
    this.validateInputFieldsService.checkIfNameIsValid(name);
  }

  subscribeToValidNameField(): void {
    const subscription = this.validateInputFieldsService.nameIsValid$.subscribe(
      (isValid) => {
        this.nameIsValid = isValid;
      }
    );
    this.subscriptions.add(subscription);
  }

  validateEmail(email: string) {
    this.validateInputFieldsService.checkIfEmailIsValid(email);
  }

  subscribeToValidEmailField(): void {
    const subscription =
      this.validateInputFieldsService.emailIsValid$.subscribe((isValid) => {
        this.emailIsValid = isValid;
      });
    this.subscriptions.add(subscription);
  }

  validatePhone(phone: string): void {
    this.validateInputFieldsService.checkIfPhoneIsValid(phone);
  }

  subscribeToValidPhoneField(): void {
    const subscription =
      this.validateInputFieldsService.phoneIsValid$.subscribe((isValid) => {
        this.phoneIsValid = isValid;
      });
    this.subscriptions.add(subscription);
  }

  setRandomColorForContact() {
    this.newContact.color = this.randomColorService.getRandomColor();
    this.newContact.color_brightness =
      this.colorBrightnessService.isColorBright(this.newContact.color);
  }

  resetForm() {
    this.newContact = {
      name: '',
      email: '',
      phone_number: '',
      color: '',
      created_by: null,
    };
  }

  clearInputFields(form?: NgForm) {
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }

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

  subscribeToCloseContactFormEvent(): void {
    const subscription = this.actionService.closeContactFormEvent.subscribe(
      () => {
        this.clearInputFields();
        this.showAnimation = false;

        setTimeout(() => {
          this.contactStatusService.setContactFormStatus({
            visible: false,
            mode: 'add',
          });
        }, 500);
      }
    );

    this.subscriptions.add(subscription);
  }

  onSubmit(): void {
    if (this.nameIsValid && this.emailIsValid && this.phoneIsValid) {
      if (this.isAddContactMode) {
        this.handleAddContact();
      } else if (this.currentContact) {
        this.handleEditContact();
      }
    }
  }

  handleAddContact(): void {
    const color = this.randomColorService.getRandomColor();
    const color_brightness = this.colorBrightnessService.isColorBright(color);

    const contactToCreate: Omit<Contact, 'id'> = {
      ...this.newContact,
      color,
      color_brightness,
    };

    this.contactService.addContactOptimistically(contactToCreate);
    this.sendNewContactToServer(contactToCreate);
  }

  sendNewContactToServer(contactToCreate: Omit<Contact, 'id'>): void {
    this.contactService.addData(contactToCreate as Contact).subscribe({
      next: (newContactFromBackend) => {
        this.contactService.updateContactListAfterAdd(newContactFromBackend);
        this.clearInputFields();
        this.contactStatusService.setContactFormStatus({
          visible: false,
          mode: 'add',
        });
        this.actionService.handleInfoContainers({
          infoText: 'Contact successfully created!',
          isVisible: true,
          persistent: false,
        });
      },
      error: (err) => {
        console.error('Fehler beim Erstellen des Kontakts:', err);
        this.actionService.handleInfoContainers({
          infoText: 'Error: Could not create contact.',
          isVisible: true,
          persistent: false,
        });
      },
    });
  }

  handleEditContact(): void {
    const subscription = this.contactService
      .updateData(this.currentContact!.id!, this.newContact)
      .subscribe(this.getEditContactObserver());

    this.subscriptions.add(subscription);
  }

  private getEditContactObserver() {
    return {
      next: (updatedContactFromBackend: Contact) => {
        this.contactService.updateContactListAfterEdit(
          updatedContactFromBackend
        );
        this.contactService.setCurrentContact(updatedContactFromBackend);
        this.actionService.closeContactForm();

        this.actionService.handleInfoContainers({
          infoText: 'Contact successfully updated!',
          isVisible: true,
          persistent: false,
        });
      },
      error: (err: any) => {
        console.error('Update-Fehler:', err);
        this.actionService.handleInfoContainers({
          infoText: 'Error: Could not update contact.',
          isVisible: true,
          persistent: false,
        });
      },
    };
  }
}
