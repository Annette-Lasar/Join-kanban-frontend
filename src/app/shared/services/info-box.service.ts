import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class InfoBoxService {
  private successStatus = new BehaviorSubject<boolean>(false);
  successStatus$: Observable<boolean> = this.successStatus.asObservable();

  private infoBoxStatus = new BehaviorSubject<boolean>(false);
  infoBoxStatus$: Observable<boolean> = this.infoBoxStatus.asObservable();

  private confirmDeleteSubject = new Subject<void>();
  confirmDelete$: Observable<void> =
    this.confirmDeleteSubject.asObservable();

  /* =============================================================
  
  METHODS

  ================================================================  */

  setSuccessStatus(status: boolean): void {
    this.successStatus.next(status);
  }

  setInfoBoxStatus(status: boolean): void {
    this.infoBoxStatus.next(status);
  }

  triggerDelete(): void {
    this.confirmDeleteSubject.next();
  }
}
