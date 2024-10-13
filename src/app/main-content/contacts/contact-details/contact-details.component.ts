import {
  Component,
  HostListener,
  OnInit,
  OnDestroy,
  Input,
  Output,
  EventEmitter,
} from '@angular/core';
import { Contact } from '../../../shared/interfaces/contact.interface';
import { ContactService } from '../../../shared/services/contact.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'join-contact-details',
  standalone: true,
  imports: [],
  templateUrl: './contact-details.component.html',
  styleUrl: './contact-details.component.scss',
})
export class ContactDetailsComponent implements OnInit, OnDestroy {
  isMobile: boolean = false;
  @Input() showContactDetails: boolean = false;
  @Input() contact: Contact | null = null;
  @Output() showContactOverview = new EventEmitter<boolean>();
  private subscription: Subscription | null = null;

  constructor(private contactService: ContactService) {}

  ngOnInit(): void {
    console.log('Kontakt: ', this.contact);
    this.checkViewport();
    this.updateShowContactDetails();
    this.updateContactObject();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    this.checkViewport();
  }


  checkViewport() {
    this.isMobile = window.innerWidth < 800;
  }

  updateShowContactDetails() {
    this.subscription = this.contactService.showDetails$.subscribe((value) => {
      this.showContactDetails = value;
    });
  }

  updateContactObject() {
    this.subscription = this.contactService.currentContact$.subscribe(
      (contact) => {
        this.contact = contact;
        console.log('Aktueller Kontakt in der Kindkomponente:', this.contact);
      }
    );
  }

  onBackButtonClick() {
    this.showContactOverview.emit(false);
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
