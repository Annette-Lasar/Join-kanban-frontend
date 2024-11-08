import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ContactStatusService {
  private isAddContactModeStatus = new BehaviorSubject<boolean>(true);
  isAddContactModeStatus$ = this.isAddContactModeStatus.asObservable();

  private contactFormStatus = new BehaviorSubject<boolean>(false);
  contactFormStatus$ = this.contactFormStatus.asObservable();

  private showDetailsStatus = new BehaviorSubject<boolean>(false);
  showDetailsStatus$ = this.showDetailsStatus.asObservable();

  private contactDetailFormStatus = new BehaviorSubject<boolean>(false);
  contactDetailFormStatus$ = this.contactDetailFormStatus.asObservable();

  private deleteContactStatus = new BehaviorSubject<boolean>(false);
  deleteContactStatus$ = this.deleteContactStatus.asObservable();

  private successStatus = new BehaviorSubject<boolean>(false);
  successStatus$ = this.successStatus.asObservable();

  private infoBoxStatus = new BehaviorSubject<boolean>(false);
  infoBoxStatus$ = this.infoBoxStatus.asObservable();

  /* =============================================================
  
  METHODS

  ================================================================  */

  setIsAddContactModeStatus(status: boolean): void {
    this.isAddContactModeStatus.next(status);
  }

  setContactFormStatus(status: boolean): void {
    this.contactFormStatus.next(status);
  }

  setShowDetailsStatus(status: boolean): void {
    this.showDetailsStatus.next(status);
  }

  setContactDetailFormStatus(status: boolean): void {
    this.contactDetailFormStatus.next(status);
  }

  setDeleteContactStatus(status: boolean): void {
    this.deleteContactStatus.next(status);
  }

  setSuccessStatus(status: boolean): void {
    this.successStatus.next(status);
  }


  setInfoBoxStatus(status: boolean): void {
    this.infoBoxStatus.next(status);
  }
}
