import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class ContactStatusService {
    private deleteContactStatus = new BehaviorSubject<boolean>(false);
    deleteContactStatus$ = this.deleteContactStatus.asObservable();

    setDeleteContactStatus(status: boolean) {
        this.deleteContactStatus.next(status);
    }

}