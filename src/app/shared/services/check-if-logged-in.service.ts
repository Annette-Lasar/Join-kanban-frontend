import { Injectable } from '@angular/core';
import { LocalStorageService } from './local-storage.service';

@Injectable({
  providedIn: 'root',
})
export class CheckIfLoggedInService {
  constructor(private localStorageService: LocalStorageService) {}

  checkIfLoggedIn(): boolean {
    const userType = this.localStorageService.getUserTypeFromLocalStorage();
    return !!userType;
  }
}
