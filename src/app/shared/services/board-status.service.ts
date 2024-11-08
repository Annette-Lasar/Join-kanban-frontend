import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class BoardStatusService {
  boardSuccessStatus = new BehaviorSubject<boolean>(false);
  boardSuccessStatus$ = this.boardSuccessStatus.asObservable();

  /* =============================================================
  
  METHODS

  ================================================================  */

  setBoardSuccessStatus(status: boolean): void {
    this.boardSuccessStatus.next(status);
  }

  toggleBoardSuccessStatus() {
    let currentStatus = this.boardSuccessStatus.getValue();
    this.boardSuccessStatus.next(!currentStatus);
  }
}
