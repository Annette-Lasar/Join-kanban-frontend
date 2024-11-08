import {
  Component,
  HostListener,
  OnInit,
  OnDestroy,
  Input,
} from '@angular/core';
import { Contact } from '../../../shared/interfaces/contact.interface';
import { ContactService } from '../../../shared/services/contact.service';
import { Subscription } from 'rxjs';
import { InfoComponent } from '../../../shared/components/info/info.component';
import { ContactStatusService } from '../../../shared/services/contact-status.service';

@Component({
  selector: 'join-contact-details',
  standalone: true,
  imports: [InfoComponent],
  templateUrl: './contact-details.component.html',
  styleUrl: './contact-details.component.scss',
})
export class ContactDetailsComponent implements OnInit, OnDestroy {
  isMobile: boolean = false;
  private subscription: Subscription | null = null;

  @Input() contact: Contact | null = null;
  showContactDetails: boolean = false;

  constructor(
    private contactService: ContactService,
    private contactStatusService: ContactStatusService
  ) {}

  ngOnInit(): void {
    this.checkViewport();
    this.getUpdatedShowContactDetails();
    this.updateContactObject();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    this.checkViewport();
  }

  checkViewport() {
    this.isMobile = window.innerWidth < 800;
  }

  getUpdatedShowContactDetails() {
    this.subscription = this.contactStatusService.showDetailsStatus$.subscribe(
      (status) => {
        this.showContactDetails = status;
      }
    );
  }

  updateContactObject() {
    this.subscription = this.contactService.currentContact$.subscribe(
      (contact) => {
        this.contact = contact;
      }
    );
  }

  onBackButtonClick() {
    this.contactStatusService.setShowDetailsStatus(false);
    this.contactStatusService.setIsAddContactModeStatus(true);
  }

  isFormStatusChanged() {
    this.contactStatusService.setContactFormStatus(true);
  }

  showWarningMessage() {
    this.contactStatusService.setInfoBoxStatus(true);
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
