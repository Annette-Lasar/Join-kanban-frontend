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

  private deleteContactStatus = new BehaviorSubject<boolean>(false);
  deleteContactStatus$ = this.deleteContactStatus.asObservable();

  setIsAddContactModeStatus(status: boolean): void {
    this.isAddContactModeStatus.next(status);
  }

  setContactFormStatus(status: boolean): void {
    this.contactFormStatus.next(status);
  }

  setShowDetailsStatus(status: boolean): void {
    this.showDetailsStatus.next(status);
  }

  setDeleteContactStatus(status: boolean): void {
    this.deleteContactStatus.next(status);
  }
}
