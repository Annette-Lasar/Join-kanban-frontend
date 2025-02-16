import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class InfoBoxService {
  private successStatus = new BehaviorSubject<boolean>(false);
  successStatus$ = this.successStatus.asObservable();

  // ÄNDERN AUF FALSE!!
  private infoBoxStatus = new BehaviorSubject<boolean>(false);
  infoBoxStatus$ = this.infoBoxStatus.asObservable();

  /* =============================================================
  
  METHODS

  ================================================================  */

  setSuccessStatus(status: boolean): void {
    this.successStatus.next(status);
  }

  setInfoBoxStatus(status: boolean): void {
    this.infoBoxStatus.next(status);
  }
}
