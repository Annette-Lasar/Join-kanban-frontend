import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class HeaderStatusService {
  private headerContextMenuStatus = new BehaviorSubject<boolean>(false);
  headerContextMenuStatus$: Observable<boolean> =
    this.headerContextMenuStatus.asObservable();

  /* =============================================================
  
  METHODS

  ================================================================  */

  getHeaderContextMenuStatus(): boolean {
    return this.headerContextMenuStatus.getValue();
  }

  setHeaderContextMenuStatus(newStatus: boolean): void {
    this.headerContextMenuStatus.next(newStatus);
  }
}
