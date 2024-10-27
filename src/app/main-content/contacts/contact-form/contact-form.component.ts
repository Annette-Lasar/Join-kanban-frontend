import {
  Component,
  OnInit,
  HostListener,
  Input,
  Output,
  EventEmitter,
  OnChanges,
  SimpleChanges,
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
  @Input() isAddContactMode: boolean = true;
  @Input() contactFormStatus: boolean = false;
  @Input() detailStatus: boolean = false;
  @Output() newContactFormStatus = new EventEmitter<boolean>();
  @Output() closeContactFormStatus = new EventEmitter<boolean>();

  @ViewChild('contactForm') contactForm!: NgForm;

  constructor(
    private contactService: ContactService,
    private groupContactsService: GroupContactsService,
    private randomColorService: RandomColorService,
    private colorBrightnessService: ColorBrightnessService
  ) {}

  ngOnInit(): void {
    this.checkViewport();
  }

/*   ngOnChanges(changes: SimpleChanges): void {
    if (changes['contacts']) {
      console.log('Aktualisierte Kontaktliste: ', this.contacts);
    }
  } */

  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    this.checkViewport();
  }

  checkViewport() {
    this.isMobile = window.innerWidth < 800;
  }

  closeContactForm() {
    this.contactFormStatus = false;
    this.isAddContactMode = true;
    this.closeContactFormStatus.emit(this.contactFormStatus);
  }

  emailIsValid(): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return this.newContact.email
      ? emailRegex.test(this.newContact.email)
      : false;
  }

  onSubmit() {
    if (this.newContact.name && this.emailIsValid()) {
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
    if (form) {
      form.resetForm();
    } else if (this.contactForm) {
      this.contactForm.controls['name'].markAsPristine(); 
      this.contactForm.controls['name'].markAsUntouched();
    }
    this.resetForm();
  }
}
