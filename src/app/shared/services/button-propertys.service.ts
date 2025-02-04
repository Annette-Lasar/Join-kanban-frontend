import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ButtonPropertyService {
  private toggleContainerSubject = new BehaviorSubject<string | null>(null);
  toggleContainer$ = this.toggleContainerSubject.asObservable();

  private isAddContactButtonClickedSubject = new BehaviorSubject<boolean>(
    false
  );
  isAddContactButtonClicked$ =
    this.isAddContactButtonClickedSubject.asObservable();


  private createNewContactClicked = new BehaviorSubject<boolean>(false);
  createNewContactClicked$ = this.createNewContactClicked.asObservable();

  private clearInputButtonClickedSubject = new BehaviorSubject<boolean>(false);
  clearInputButtonClicked$ = this.clearInputButtonClickedSubject.asObservable();

  private deleteContactButtonClicked = new BehaviorSubject<boolean>(false);
  deleteContactButtonClicked$ = this.deleteContactButtonClicked.asObservable();

  private successMessage = new BehaviorSubject<string | undefined>('');
  successMessage$ = this.successMessage.asObservable();

  private loginStatusSubject = new BehaviorSubject<boolean>(true);
  loginStatus$ = this.loginStatusSubject.asObservable();

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


  setLoginStatus(status: boolean): void {
    this.loginStatusSubject.next(status);
  }
}
