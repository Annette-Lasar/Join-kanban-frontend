import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ButtonPropertyService {
  private toggleContainerSubject = new BehaviorSubject<string | null>(null);
  toggleContainer$: Observable<string | null> =
    this.toggleContainerSubject.asObservable();

  private isAddContactButtonClickedSubject = new BehaviorSubject<boolean>(
    false
  );
  isAddContactButtonClicked$: Observable<boolean> =
    this.isAddContactButtonClickedSubject.asObservable();

  private createNewContactClicked = new BehaviorSubject<boolean>(false);
  createNewContactClicked$: Observable<boolean> =
    this.createNewContactClicked.asObservable();

  private clearInputButtonClickedSubject = new BehaviorSubject<boolean>(false);
  clearInputButtonClicked$: Observable<boolean> =
    this.clearInputButtonClickedSubject.asObservable();

  private deleteContactButtonClicked = new BehaviorSubject<boolean>(false);
  deleteContactButtonClicked$: Observable<boolean> =
    this.deleteContactButtonClicked.asObservable();

  // AUSLAGERN IN INFOSERVICE??
  private successMessage = new BehaviorSubject<string | undefined>('');
  successMessage$: Observable<string | undefined> =
    this.successMessage.asObservable();

  private loginStatusSubject = new BehaviorSubject<boolean>(true);
  loginStatus$ = this.loginStatusSubject.asObservable();

  private isTaskDetailVisibleStatusSubject = new BehaviorSubject<boolean>(
    false
  );
  isTaskDetailVisibleStatusSubject$: Observable<boolean> =
    this.isTaskDetailVisibleStatusSubject.asObservable();

  private taskEditModeSubject = new BehaviorSubject<boolean>(false);
  taskEditModeSubject$: Observable<boolean> =
    this.taskEditModeSubject.asObservable();

  private isCancelAddSubtaskVisibleSubject = new BehaviorSubject<boolean>(
    false
  );
  isCancelAddSubtaskVisibleSubject$: Observable<boolean> =
    this.isCancelAddSubtaskVisibleSubject.asObservable();

  private editSubtaskSubject = new BehaviorSubject<boolean>(false);
  editSubtaskSubject$: Observable<boolean> =
    this.editSubtaskSubject.asObservable();

  /* =============================================================
  
  METHODS

  ================================================================  */

  setToggleContainerStatus(message: string) {
    this.toggleContainerSubject.next(message);
  }

  setIsAddContactButtonStatus(status: boolean): void {
    this.isAddContactButtonClickedSubject.next(status);
  }

  setCreateNewContactStatus(status: boolean): void {
    this.createNewContactClicked.next(status);
  }

  setClearInputStatus(status: boolean): void {
    this.clearInputButtonClickedSubject.next(status);
  }

  setDeleteContactButtonStatus(status: boolean): void {
    this.deleteContactButtonClicked.next(status);
  }

  setOnSuccessMessageStatus(message?: string): void {
    this.successMessage.next(message);
  }

  toggleLoginStatus(): void {
    const currentStatus = this.loginStatusSubject.value;
    this.loginStatusSubject.next(!currentStatus);
  }

  setIsTaskDetailVisibleStatusSubject(status: boolean): void {
    this.isTaskDetailVisibleStatusSubject.next(status);
  }

  setTaskEditMode(status: boolean): void {
    this.taskEditModeSubject.next(status);
  }

  setCancelAddSubtaskvisible(status: boolean): void {
    this.isCancelAddSubtaskVisibleSubject.next(status);
  }

  setEditSubtaskSubject(status: boolean) {
    this.editSubtaskSubject.next(status);
  }
}
