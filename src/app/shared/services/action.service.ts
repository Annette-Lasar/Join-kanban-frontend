import { Injectable, EventEmitter } from '@angular/core';
import { ContactStatusService } from './contact-status.service';
import { ButtonPropertyService } from './button-propertys.service';
import { BoardStatusService } from './board-status.service';
import { InfoBoxService } from './info-box.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { PrepareDeleteAction } from '../constants/enum';
import { DeleteAction } from '../constants/enum';
import { createActionMap } from '../mappings/action-map';

@Injectable({
  providedIn: 'root',
})
export class ActionService {
  toggleContainer = new EventEmitter<string>();
  guestLoginEvent = new EventEmitter<void>();
  deleteTaskEvent = new EventEmitter<number>();
  deleteCategoryEvent = new EventEmitter<void>();
  saveEditedTaskEvent = new EventEmitter<void>();
  deleteContactEvent = new EventEmitter<number>();
  taskDetailEvent = new EventEmitter<number>();
  keepOriginalTaskStatusEvent = new EventEmitter<void>();
  closeEditModeEvent = new EventEmitter<void>();
  // addSubtaskEvent = new EventEmitter<string>();
  addSubtaskEvent = new EventEmitter<{ message?: string; id?: number; event?: Event }>();

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
  private taskDetailSubject = new BehaviorSubject<number | null>(null);
  taskDetailSubject$: Observable<number | null> =
    this.taskDetailSubject.asObservable();

  constructor(
    private contactStatusService: ContactStatusService,
    private buttonPropertyService: ButtonPropertyService,
    private boardStatusService: BoardStatusService,
    private infoBoxService: InfoBoxService
  ) {
    this.actionMap = createActionMap(
      this,
      this.contactStatusService,
      this.buttonPropertyService,
      this.boardStatusService,
      this.infoBoxService
    );
  }

  private actionMap: Map<string, (message?: string, id?: number, event?: Event) => void>;

  executeAction(actionType: string, id?: number, message?: string, event?: Event) {
    const action = this.actionMap.get(actionType);
    if (action) {
      action(message, id, event);
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

  toggleEditTaskMode(status: string): void {
    if (status === 'show') {
      this.keepOriginalTaskStatusEvent.emit();
      this.buttonPropertyService.setTaskEditMode(true);
    } else if (status === 'hide') {
      this.closeEditModeEvent.emit();
      this.buttonPropertyService.setTaskEditMode(false);
    } else {
      console.log(`Unknown status ${status}`);
    }
  }

  toggleAddSubtaskBox(message?: string, id?: number, event?: Event) {
    this.addSubtaskEvent.emit({message, id, event});
  }

/*     toggleAddSubtaskBox(message?: string, id?: number, event?: Event): void {
      this.addSubtaskEvent.emit(message);
    } */

  saveEditedTask(id: number): void {
    console.log('%c TaskID: ', 'color: red;', id);
    this.saveEditedTaskEvent.emit();
  }

  closeTaskDetail(id: number): void {
    this.buttonPropertyService.setIsTaskDetailVisibleStatusSubject(false);
    this.taskDetailEvent.emit();
  }

  prepareDeleteAction(id: number, actionType: string): void {
    if (!id) {
      console.warn('Keine Kategorie-ID angegeben.');
      return;
    }

    switch (actionType) {
      case PrepareDeleteAction.TASK:
        this.deleteItem(id, DeleteAction.TASK);
        break;
      case PrepareDeleteAction.ITEM:
        this.setItemToDelete(id);
        break;
      case PrepareDeleteAction.CATEGORY:
        this.deleteItem(id, DeleteAction.CATEGORY);
        break;
      case PrepareDeleteAction.CONTACT:
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
