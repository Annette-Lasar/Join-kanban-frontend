import { CommonModule} from '@angular/common';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../../../shared/services/auth.service';
import { User } from '../../../shared/interfaces/user.interface';
import { Subscription } from 'rxjs';


@Component({
  selector: 'join-user-greeting',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-greeting.component.html',
  styleUrl: './user-greeting.component.scss',
})
export class UserGreetingComponent implements OnInit, OnDestroy {
  salutation: string = '';
  user: User | null = null;
  
  private subscriptions: Subscription = new Subscription();

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.defineUser();
    this.getSalutation();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  defineUser(): void {
    const subscription = 
    this.authService.userSubject$.subscribe(user => {
      this.user = user;
    });
    this.subscriptions.add(subscription);
  }

  getSalutation() {
    const currentTime: number = new Date().getHours(); 

    if (currentTime >= 0 && currentTime < 12) {
      this.salutation = 'Good morning';
    } else if (currentTime >= 12 && currentTime < 18) {
      this.salutation = 'Good afternoon';
    } else if (currentTime >= 18 && currentTime < 22) {
      this.salutation = 'Good evening';
    } else {
      this.salutation = 'Good night';
    }
  }


}
