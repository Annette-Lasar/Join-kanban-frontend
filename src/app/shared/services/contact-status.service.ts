import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ContactStatusService {
  private isAddContactModeStatus = new BehaviorSubject<boolean>(true);
  isAddContactModeStatus$: Observable<boolean> = this.isAddContactModeStatus.asObservable();

  private contactFormStatus = new BehaviorSubject<boolean>(false);
  contactFormStatus$: Observable<boolean> = this.contactFormStatus.asObservable();

  private showDetailsStatus = new BehaviorSubject<boolean>(false);
  showDetailsStatus$: Observable<boolean> = this.showDetailsStatus.asObservable();

  private contactDetailFormStatus = new BehaviorSubject<boolean>(false);
  contactDetailFormStatus$: Observable<boolean> = this.contactDetailFormStatus.asObservable();

  private deleteContactStatus = new BehaviorSubject<boolean>(false);
  deleteContactStatus$: Observable<boolean> = this.deleteContactStatus.asObservable();

/*   private successStatus = new BehaviorSubject<boolean>(false);
  successStatus$ = this.successStatus.asObservable(); */

/*   private infoBoxStatus = new BehaviorSubject<boolean>(false);
  infoBoxStatus$ = this.infoBoxStatus.asObservable(); */

  /* =============================================================
  
  METHODS

  ================================================================  */

  setIsAddContactModeStatus(status: boolean): void {
    this.isAddContactModeStatus.next(status);
  }

  getAddContactModeStatus(): boolean {
    return this.isAddContactModeStatus.getValue();
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

/*   setSuccessStatus(status: boolean): void {
    this.successStatus.next(status);
  } */


/*   setInfoBoxStatus(status: boolean): void {
    this.infoBoxStatus.next(status);
  } */
}
