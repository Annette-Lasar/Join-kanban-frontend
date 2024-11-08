/* import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ContactStatusService } from '../../services/contact-status.service';

@Component({
  selector: 'join-button',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './button.component.html',
  styleUrl: './button.component.scss',
})
export class ButtonComponent {
  @Input() caption: string = '';
  @Input() buttonClass: string = '';
  @Input() padding: string = '1em 1.5em';
  @Input() width: string = '75px';
  @Input() height: string = '75px';
  @Input() imgSrc: string = '';
  @Input() imgClass: string = '';
  @Input() buttonIcon: boolean = false;
  @Input() buttonCaptionFirst: boolean = false;
  @Input() buttonCaptionSecond: boolean = false;
  @Input() prioClass: string = '';
  @Input() isPrioButton: boolean = false;
  @Input() buttonColor: string = '';
  @Input() alt: string = '';
  @Input() routerLink: string | null = null;
  @Input() tooltip: string = '';
  @Input() infoMessage: string = '';
  @Input() defaultSrc: string = '';
  @Input() activeSrc: string = '';
  @Input() type: 'button' | 'submit' = 'button';
  @Input() prioStatus: string = '';
  @Input() actionType: string = '';
  @Input() actionFunction: (
    event: Event,
    actionType?: string,
    message?: string
  ) => void = (event, actionType, message) => {
    event.stopPropagation();
    this.handleAction(actionType, message);
  };

  @Output() toggleContainer = new EventEmitter<string>();
  @Output() isAddContactButtonClicked = new EventEmitter<void>();
  @Output() isContactDetailOptionsButtonClicked = new EventEmitter<void>();
  @Output() isEditContactButtonClicked = new EventEmitter<void>();
  @Output() createNewContactClicked = new EventEmitter<void>();
  @Output() clearInputButtonClicked = new EventEmitter<void>();
  @Output() deleteContactButtonClicked = new EventEmitter<void>();
  @Output() successMessage = new EventEmitter<void>();

  constructor(private contactStatusService: ContactStatusService) {}

  handleAction(actionType?: string, message?: string): void {
    if (actionType === 'toggle') {
      this.toggleContainer.emit(message);
    } else if (actionType === 'showAddContactForm') {
      this.onIsAddContactButtonClick();
    } else if (actionType === 'showContactDetailOptions') {
      this.onIsContactDetailOptionsButtonClicked();
    } else if (actionType === 'showEditContactForm') {
      this.onIsEditContactButtonClick();
    } else if (actionType === 'createNewContact') {
      this.onCreateContactClick();
    } else if (actionType === 'clearInputFields') {
      this.onClearInputClick();
    } else if (actionType === 'openSecurityInfo') {
      this.showOrHideInfoBox(true);
    } else if (actionType === 'deleteContact') {
      //
    } else if (actionType === 'closeSecurityInfo') {
      this.showOrHideInfoBox(false);
    }
  }

  onIsAddContactButtonClick() {
    this.isAddContactButtonClicked.emit();
  }

  onIsEditContactButtonClick() {
    this.contactStatusService.setContactFormStatus(true);
  }

  onIsContactDetailOptionsButtonClicked() {
    this.contactStatusService.setContactDetailFormStatus(true);

  }

  onCreateContactClick() {
    this.createNewContactClicked.emit();
    this.successMessage.emit();
  }

  onClearInputClick() {
    this.clearInputButtonClicked.emit();
  }

  showOrHideInfoBox(statusValue: boolean): void {
    if (statusValue) {
      this.contactStatusService.setDeleteContactStatus(statusValue);
    } else if (statusValue === false) {
      this.contactStatusService.setDeleteContactStatus(statusValue);
    }
  }

  setPrioStatus(newStatus: string) {
    this.prioStatus = newStatus;
  }

  get isPrioActive(): boolean {
    return this.prioStatus === this.caption.toLowerCase();
  }
} */

import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ContactStatusService } from '../../services/contact-status.service';
import { ActionService } from '../../services/action.service';

@Component({
  selector: 'join-button',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './button.component.html',
  styleUrl: './button.component.scss',
})
export class ButtonComponent {
  @Input() caption: string = '';
  @Input() buttonClass: string = '';
  @Input() padding: string = '1em 1.5em';
  @Input() width: string = '75px';
  @Input() height: string = '75px';
  @Input() imgSrc: string = '';
  @Input() imgClass: string = '';
  @Input() buttonIcon: boolean = false;
  @Input() buttonCaptionFirst: boolean = false;
  @Input() buttonCaptionSecond: boolean = false;
  @Input() prioClass: string = '';
  @Input() isPrioButton: boolean = false;
  @Input() buttonColor: string = '';
  @Input() alt: string = '';
  @Input() routerLink: string | null = null;
  @Input() tooltip: string = '';
  @Input() infoMessage: string = '';
  @Input() defaultSrc: string = '';
  @Input() activeSrc: string = '';
  @Input() type: 'button' | 'submit' = 'button';
  @Input() prioStatus: string = '';
  @Input() actionType: string = '';
  @Input() actionFunction: (
    event: Event,
    actionType?: string,
    message?: string
  ) => void = (event, actionType, message) => {
    event.stopPropagation();
    this.actionService.executeAction(actionType!, message);
  };

  @Output() toggleContainer = new EventEmitter<string>();
  @Output() isAddContactButtonClicked = new EventEmitter<void>();
  @Output() isContactDetailOptionsButtonClicked = new EventEmitter<void>();
  @Output() isEditContactButtonClicked = new EventEmitter<void>();
  @Output() createNewContactClicked = new EventEmitter<void>();
  @Output() clearInputButtonClicked = new EventEmitter<void>();
  @Output() deleteContactButtonClicked = new EventEmitter<void>();
  @Output() successMessage = new EventEmitter<void>();

  constructor(
    private contactStatusService: ContactStatusService,
    private actionService: ActionService
  ) {}

  setPrioStatus(newStatus: string) {
    this.prioStatus = newStatus;
  }

  get isPrioActive(): boolean {
    return this.prioStatus === this.caption.toLowerCase();
  }
}
