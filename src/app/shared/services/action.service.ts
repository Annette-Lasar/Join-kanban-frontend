import { Injectable, EventEmitter } from '@angular/core';
import { ContactStatusService } from './contact-status.service';
import { ButtonPropertyService } from './button-propertys.service';
import { BoardStatusService } from './board-status.service';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class ActionService {
  toggleContainer = new EventEmitter<string>();
  guestLoginEvent = new EventEmitter<void>();

  constructor(
    private contactStatusService: ContactStatusService,
    private buttonPropertyService: ButtonPropertyService,
    private boardStatusService: BoardStatusService,
    private authService: AuthService
  ) {}

  private actionMap = new Map<string, (message?: string) => void>([
    ['toggle', (message) => this.toggleInfoContainer(message)],
    [
      'showAddContactForm',
      () => this.buttonPropertyService.setIsAddContactButtonStatus(true),
    ],
    [
      'showContactDetailOptions',
      () => this.contactStatusService.setContactDetailFormStatus(true),
    ],
    [
      'showEditContactForm',
      () => this.contactStatusService.setContactFormStatus(true),
    ],
    ['createNewContact', () => this.onCreateContactClick()],
    [
      'clearInputFields',
      () => this.buttonPropertyService.setClearInputStatus(true),
    ],
    ['openSecurityInfo', () => this.showOrHideInfoBox(true)],
    ['closeSecurityInfo', () => this.showOrHideInfoBox(false)],
    ['deleteContact', () => this.deleteContact()],
    ['onToggleShowLogin', () => this.showSignUp()],
    ['guestLogin', () => this.triggerGuestLogin()],
    // add further actions here if necessary
  ]);

  executeAction(actionType: string, message?: string) {
    const action = this.actionMap.get(actionType);
    if (action) {
      action(message);
    } else {
      console.warn(`Action ${actionType} is not defined.`);
    }
  }

  toggleInfoContainer(message?: string): void {
    this.boardStatusService.toggleBoardSuccessStatus();
    this.buttonPropertyService.setOnSuccessMessageStatus(message);
  }

  onCreateContactClick(): void {
    this.buttonPropertyService.setCreateNewContactStatus(true);
  }

  showOrHideInfoBox(statusValue: boolean): void {
    if (statusValue) {
      this.contactStatusService.setInfoBoxStatus(statusValue);
    } else if (statusValue === false) {
      this.contactStatusService.setInfoBoxStatus(statusValue);
    }
  }

  deleteContact(): void {
    this.contactStatusService.setDeleteContactStatus(true);
  }

  showSignUp(): void {
    this.buttonPropertyService.toggleLoginStatus();
  }

  /*   guestLogin(): void {
    this.authService.guestLogin();
  } */

  triggerGuestLogin(): void {
    this.guestLoginEvent.emit(); 
  }
}
