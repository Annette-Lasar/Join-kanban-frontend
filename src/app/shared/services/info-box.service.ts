import { Injectable } from '@angular/core';
import { InfoMessage } from '../interfaces/info-message.interface';
import { BehaviorSubject, Subject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class InfoBoxService {
  private infoBoxSubject = new BehaviorSubject<InfoMessage | null>(null);
  infoBoxSubject$: Observable<InfoMessage | null> =
    this.infoBoxSubject.asObservable();
  

  private infoBoxStatus = new BehaviorSubject<boolean>(false);
  infoBoxStatus$: Observable<boolean> = this.infoBoxStatus.asObservable();

  private confirmDeleteSubject = new Subject<void>();
  confirmDelete$: Observable<void> = this.confirmDeleteSubject.asObservable();

  private successMessage = new BehaviorSubject<string | undefined>('');
  successMessage$: Observable<string | undefined> =
    this.successMessage.asObservable();
  /* =============================================================
  
  METHODS

  ================================================================  */

  setInfoBox(message: Partial<InfoMessage>, duration: number = 3000): void {
    this.infoBoxSubject.next(message);
  
    if (!message.persistent) {
      setTimeout(() => {
        this.clearInfoBox();
      }, duration);
    }
  }
  
  clearInfoBox(): void {
    this.infoBoxSubject.next(null);
  }

  getInfoBoxData(): InfoMessage | null {
    return this.infoBoxSubject.getValue();
  }
  
  
  
  
  
  /*  setSuccessStatus(status: boolean): void {
    this.successStatus.next(status);
  } */

  setInfoBoxStatus(status: boolean): void {
    this.infoBoxStatus.next(status);
  }

  triggerDelete(): void {
    this.confirmDeleteSubject.next();
  }

  setOnSuccessMessageStatus(message?: string): void {
    this.successMessage.next(message);
  }
}
