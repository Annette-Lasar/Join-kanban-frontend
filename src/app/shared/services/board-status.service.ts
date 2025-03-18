import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class BoardStatusService {
  boardSuccessStatus = new BehaviorSubject<boolean>(false);
  boardSuccessStatus$: Observable<boolean> =
    this.boardSuccessStatus.asObservable();

  boardTaskOverlayOpenStatus = new BehaviorSubject<boolean>(false);
  boardTaskOverlayOpenStatus$: Observable<boolean> =
    this.boardTaskOverlayOpenStatus.asObservable();


  /* =============================================================
    METHODS
  ================================================================  */

  setBoardSuccessStatus(status: boolean): void {
    this.boardSuccessStatus.next(status);
  }

  setBoardTaskOverlayOpenStatus(status: boolean): void {
    this.boardTaskOverlayOpenStatus.next(status);
  }
}
