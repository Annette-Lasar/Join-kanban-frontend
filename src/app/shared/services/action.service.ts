import { Injectable, EventEmitter } from '@angular/core';
import { ContactStatusService } from './contact-status.service';
import { ButtonPropertyService } from './button-propertys.service';
import { BoardStatusService } from './board-status.service';
import { InfoBoxService } from './info-box.service';
import { TaskService } from './task.service';
import { BehaviorSubject, Observable, of } from 'rxjs';
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
  saveEditedTaskEvent = new EventEmitter<number>();
  deleteContactEvent = new EventEmitter<number>();
  taskDetailEvent = new EventEmitter<void>();
  keepOriginalTaskStatusEvent = new EventEmitter<void>();
  closeEditModeEvent = new EventEmitter<void>();
  addSubtaskEvent = new EventEmitter<{
    message?: string;
    id?: number;
    event?: Event;
  }>();
  deleteSubtaskEvent = new EventEmitter<number>();
  saveEditedSubtaskEvent = new EventEmitter<number>();
  openEditSubtaskBoxEvent = new EventEmitter<number>();
  createNewTaskEvent = new EventEmitter<string>();
  resetNewTaskEvent = new EventEmitter<void>();
  openAddTaskOverlayEvent = new EventEmitter<string>();
  closeAddTaskOverlayEvent = new EventEmitter<void>();

  private setItemToDeleteSubject = new BehaviorSubject<number | null>(null);
  setItemToDelete$: Observable<number | null> =
    this.setItemToDeleteSubject.asObservable();
  private deleteCategorySubject = new BehaviorSubject<number | null>(null);
  deleteCategorySubject$: Observable<number | null> =
    this.deleteCategorySubject.asObservable();
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
    private infoBoxService: InfoBoxService,
    private taskService: TaskService
  ) {
    this.actionMap = createActionMap(
      this,
      this.contactStatusService,
      this.buttonPropertyService,
      this.boardStatusService,
      this.infoBoxService
    );
  }

  private actionMap: Map<
    string,
    (message?: string, id?: number, event?: Event) => void
  >;

  executeAction(
    actionType: string,
    id?: number,
    message?: string,
    event?: Event
  ) {
    const action = this.actionMap.get(actionType);
    if (action) {
      action(message, id, event);
    } else {
      console.warn(`Action ${actionType} is not defined.`);
    }
  }

  toggleInfoContainer(message?: string): void {
    this.buttonPropertyService.setOnSuccessMessageStatus(message);
  }

  onCreateContactClick(): void {
    this.buttonPropertyService.setCreateNewContactStatus(true);
  }

  organizeSecurityQuestion(id: number, actionType: string): void {
    this.showOrHideInfoBox(true);
    if (actionType === 'setItemToDelete') {
      this.prepareDeleteAction(id, actionType);
    }
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

  toggleEditTaskMode(status: string, id: number): void {
    if (status === 'show') {
      this.keepOriginalTaskStatusEvent.emit();
      this.taskService.setContactsFromTask(id);
      this.buttonPropertyService.setTaskEditMode(true);
    } else if (status === 'hide') {
      this.taskService.clearAssignedContacts();
      this.closeEditModeEvent.emit();
      this.buttonPropertyService.setTaskEditMode(false);
    } else {
      console.log(`Unknown status ${status}`);
    }
  }

  toggleAddSubtaskBox(message?: string, id?: number, event?: Event) {
    this.addSubtaskEvent.emit({ message, id, event });
  }

  deleteSubtask(id?: number): void {
    this.deleteSubtaskEvent.emit(id);
  }

  openEditSubtaskBox(id?: number): void {
    this.openEditSubtaskBoxEvent.emit(id);
  }

  saveEditedSubtask(id?: number): void {
    this.saveEditedSubtaskEvent.emit(id);
  }

  saveEditedTask(id?: number): void {
    this.saveEditedTaskEvent.emit(id);
  }


  resetNewTask(): void {
    this.resetNewTaskEvent.emit();
  }

  closeTaskDetail(): void {
    this.taskDetailEvent.emit();
  }

  openAddTaskOverlay(message: string): void {
    this.openAddTaskOverlayEvent.emit(message);
  }

  closeAddTaskOverlay(): void {
    this.closeAddTaskOverlayEvent.emit();
  }

  prepareDeleteAction(id: number, actionType: string): void {
    if (!id) {
      console.warn('No category id declared.');
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

  setItemToDelete(id: number): void {
    this.setItemToDeleteSubject.next(id);
  }

  deleteItem(id: number, action: DeleteAction): void {
    switch (action) {
      case DeleteAction.CATEGORY:
        this.deleteCategoryEvent.emit();
        this.deleteCategorySubject.next(id);
        break;

      case DeleteAction.TASK:
        this.deleteTaskEvent.emit(id);
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
