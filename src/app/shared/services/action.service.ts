import { Injectable, EventEmitter } from '@angular/core';
import { ContactStatusService } from './contact-status.service';
import { ButtonPropertyService } from './button-propertys.service';
import { BoardStatusService } from './board-status.service';
import { InfoBoxService } from './info-box.service';
import { BehaviorSubject, Observable } from 'rxjs';

enum DeleteAction {
  CATEGORY = 'category',
  TASK = 'task',
  CONTACT = 'contact',
}

@Injectable({
  providedIn: 'root',
})
export class ActionService {
  toggleContainer = new EventEmitter<string>();
  guestLoginEvent = new EventEmitter<void>();
  deleteTaskEvent = new EventEmitter<number>();
  deleteCategoryEvent = new EventEmitter<void>();
  deleteContactEvent = new EventEmitter<number>();

  private setItemToDeleteSubject = new BehaviorSubject<number | null>(null);
  setItemToDelete$: Observable<number | null> =
    this.setItemToDeleteSubject.asObservable();
  private deleteCategorySubject = new BehaviorSubject<number | null>(null);
  deleteCategorySubject$: Observable<number | null> =
    this.deleteCategorySubject.asObservable();
  private deleteTaskSubject = new BehaviorSubject<number | null>(null);
  deleteTaskSubject$: Observable<number | null> =
    this.deleteTaskSubject.asObservable();
  private deleteContactSubject = new BehaviorSubject<number | null>(null);
  deleteContactSubject$: Observable<number | null> =
    this.deleteContactSubject.asObservable();

  constructor(
    private contactStatusService: ContactStatusService,
    private buttonPropertyService: ButtonPropertyService,
    private boardStatusService: BoardStatusService,
    private infoBoxService: InfoBoxService
  ) {}

  private actionMap = new Map<string, (message?: string, id?: number) => void>([
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
    [
      'openSecurityInfo',
      (message, id) => this.organizeSecurityQuestion(id!, 'setItemToDelete'),
    ],
    ['closeSecurityInfo', () => this.showOrHideInfoBox(false)],
    ['onToggleShowLogin', () => this.showSignUp()],
    ['guestLogin', () => this.triggerGuestLogin()],
    [
      'setTaskToDelete',
      (message, id) => this.prepareDeleteAction(id!, 'setTaskToDelete'),
    ],
    [
      'deleteTask',
      (message, id) => this.prepareDeleteAction(id!, 'deleteTask'),
    ],
    [
      'deleteCategory',
      (message, id) => this.prepareDeleteAction(id!, 'deleteCategory'),
    ],
    [
      'setContactToDelete',
      (message, id) => this.prepareDeleteAction(id!, 'setContactToDelete'),
    ],
    [
      'deleteContact',
      (message, id) => this.prepareDeleteAction(id!, 'deleteContact'),
    ],
    // add further actions here if necessary.
  ]);

  executeAction(actionType: string, id?: number, message?: string) {
    const action = this.actionMap.get(actionType);
    if (action) {
      console.log(`executeAction aufgerufen mit:`, { actionType, id, message });
      action(message, id);
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

  organizeSecurityQuestion(id: number, actionType: string): void {
    this.prepareDeleteAction(id, actionType);
    this.showOrHideInfoBox(true);
  }

  showOrHideInfoBox(statusValue: boolean): void {
    if (statusValue) {
      this.infoBoxService.setInfoBoxStatus(statusValue);
    } else if (statusValue === false) {
      this.infoBoxService.setInfoBoxStatus(statusValue);
    }
  }

  showSignUp(): void {
    this.buttonPropertyService.toggleLoginStatus();
  }

  triggerGuestLogin(): void {
    this.guestLoginEvent.emit();
  }

  prepareDeleteAction(id: number, actionType: string): void {
    if (!id) {
      console.warn('Keine Kategorie-ID angegeben.');
      return;
    }

    switch (actionType) {
      case 'deleteTask':
        this.deleteItem(id, DeleteAction.TASK);
        break;
      case 'setItemToDelete':
        this.setItemToDelete(id);
        break;
      case 'deleteCategory':
        this.deleteItem(id, DeleteAction.CATEGORY);
        break;
      case 'deleteContact':
        this.deleteItem(id, DeleteAction.CONTACT);
        break;
      default:
        console.warn(`Unknown actionType: ${actionType}`);
    }
  }

  setItemToDelete(categoryId: number): void {
    this.setItemToDeleteSubject.next(categoryId);
  }

  deleteItem(id: number, action: DeleteAction): void {
    switch (action) {
      case DeleteAction.CATEGORY:
        this.deleteCategoryEvent.emit();
        console.log(`deleteCategory wurde aufgerufen mit ID: ${id}`);
        this.deleteCategorySubject.next(id);
        break;

      case DeleteAction.TASK:
        this.deleteTaskEvent.emit();
        console.log(`deleteTask wurde aufgerufen mit ID: ${id}`);
        this.deleteTaskSubject.next(id);
        break;

      case DeleteAction.CONTACT:
        this.deleteContactEvent.emit();
        console.log(`deleteContact wurde aufgerufen mit ID: ${id}`);
        this.deleteContactSubject.next(id);
        break;

      default:
        console.warn(`Unknown action: ${action}`);
    }
  }
}
