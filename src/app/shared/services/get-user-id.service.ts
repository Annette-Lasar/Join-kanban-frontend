/* import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class UserIdService {
  getUserId(): number {
    const userId = localStorage.getItem('userId');
    let userIdToNumber;
    if (userId) {
      userIdToNumber = parseFloat(userId);
    }
    console.log('UserId: ', userIdToNumber);
    return userIdToNumber;
  }
}
 */