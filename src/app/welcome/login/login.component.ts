import {
  Component,
  Output,
  EventEmitter,
  OnInit,
  OnDestroy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../shared/services/auth.service';
import { ActionService } from '../../shared/services/action.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'join-login',
  standalone: true,
  imports: [CommonModule, ButtonComponent, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent implements OnInit, OnDestroy {
  @Output() toggleLogIn = new EventEmitter<boolean>();
  buttonLinkClassLight: string = '';
  username: string = '';
  password: string = '';
  private guestLoginSubscription!: Subscription;

  constructor(
    private authService: AuthService,
    private router: Router,
    private actionService: ActionService
  ) {}

  ngOnInit(): void {
    this.guestLoginSubscription = this.actionService.guestLoginEvent.subscribe(
      () => {
        this.guestLogin();
      }
    );
  }

  login(): void {
    if (!this.username || !this.password) {
      console.log('Bitte fülle beide Felder aus!');
      return;
    }

    this.verifyUserInformation();
  }

  verifyUserInformation() {
    this.authService.login(this.username, this.password).subscribe({
      next: () => {
        console.log('Login erfolgreich!');
        this.router.navigate(['/main-content/summary']);
      },
      error: (err) => {
        console.error('Login fehlgeschlagen:', err);
      },
    });
  }

  guestLogin(): void {
    this.authService.guestLogin().subscribe({
      next: () => {
        console.log('Guest Login erfolgreich!');
        this.router.navigate(['/main-content/summary']);
      },
      error: (err) => {
        console.error('Guest Login fehlgeschlagen:', err);
      },
    });
  }

  ngOnDestroy(): void {
    this.guestLoginSubscription.unsubscribe();
  }
}
