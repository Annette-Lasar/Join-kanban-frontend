import { Injectable } from '@angular/core';
import { ContactFormViewState } from '../interfaces/contact-form-view-state.interface';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ContactStatusService {
  private contactFormStatus = new BehaviorSubject<ContactFormViewState>({
    visible: false,
    mode: 'add',
  });
  contactFormStatus$: Observable<ContactFormViewState> =
    this.contactFormStatus.asObservable();

  private showDetailsStatus = new BehaviorSubject<boolean>(false);
  showDetailsStatus$: Observable<boolean> =
    this.showDetailsStatus.asObservable();

  private contactDetailFormStatus = new BehaviorSubject<boolean>(false);
  contactDetailFormStatus$: Observable<boolean> =
    this.contactDetailFormStatus.asObservable();

  private deleteContactStatus = new BehaviorSubject<boolean>(false);
  deleteContactStatus$: Observable<boolean> =
    this.deleteContactStatus.asObservable();

/*   private contactSuccessStatus = new BehaviorSubject<boolean>(false);
  contactSuccessStatus$ = this.contactSuccessStatus.asObservable(); */

  /*   private infoBoxStatus = new BehaviorSubject<boolean>(false);
  infoBoxStatus$ = this.infoBoxStatus.asObservable(); */

  /* =============================================================
  
  METHODS

  ================================================================  */


  setContactFormStatus(state: ContactFormViewState): void {
    this.contactFormStatus.next(state);
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

/*   setContactSuccessStatus(status: boolean): void {
    this.contactSuccessStatus.next(status);
  } */

  /*   setInfoBoxStatus(status: boolean): void {
    this.infoBoxStatus.next(status);
  } */
}
