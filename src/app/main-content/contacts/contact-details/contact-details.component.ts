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
import { ContactStatusService } from '../../../shared/services/contact-status.service';
import { InfoBoxService } from '../../../shared/services/info-box.service';
import { ButtonComponent } from '../../../shared/components/button/button.component';

@Component({
  selector: 'join-contact-details',
  standalone: true,
  imports: [ButtonComponent],
  templateUrl: './contact-details.component.html',
  styleUrl: './contact-details.component.scss',
})
export class ContactDetailsComponent implements OnInit, OnDestroy {
  contact: Contact | null = null;

  isMobile: boolean = false;
  showContactDetails: boolean = false;

  private subscription: Subscription | null = null;

  constructor(
    private contactService: ContactService,
    private contactStatusService: ContactStatusService,
    private infoBoxService: InfoBoxService
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
    this.isMobile = window.innerWidth < 1024;
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
    this.contactStatusService.setContactFormStatus({
      visible: false,
      mode: 'add',
    });
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
