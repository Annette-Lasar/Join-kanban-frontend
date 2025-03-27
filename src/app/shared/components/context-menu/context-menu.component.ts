import { Component, OnInit, OnDestroy } from '@angular/core';
import { ButtonComponent } from '../button/button.component';
import { CommonModule } from '@angular/common';
import { Contact } from '../../interfaces/contact.interface';
import { ContactStatusService } from '../../services/contact-status.service';
import { ContactService } from '../../services/contact.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'join-context-menu',
  standalone: true,
  imports: [CommonModule, ButtonComponent],
  templateUrl: './context-menu.component.html',
  styleUrl: './context-menu.component.scss',
})
export class ContextMenuComponent implements OnInit, OnDestroy {
  contactDetailFormStatus: boolean = false;
  currentContact: Contact | null = null;

  private subscriptions: Subscription = new Subscription();

  constructor(
    private contactStatusService: ContactStatusService,
    private contactService: ContactService
  ) {}

  ngOnInit(): void {
    this.subscribeToContactDetailFormStatus();
    this.subscribeToCurrentContact();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  subscribeToContactDetailFormStatus(): void {
    const subscription =
      this.contactStatusService.contactDetailFormStatus$.subscribe((status) => {
        this.contactDetailFormStatus = status;
      });
    this.subscriptions.add(subscription);
  }

  subscribeToCurrentContact(): void {
    const subscription = this.contactService.currentContact$.subscribe(
      (contact) => {
        this.currentContact = contact;
      }
    );
    this.subscriptions.add(subscription);
  }
}
