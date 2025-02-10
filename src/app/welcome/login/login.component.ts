import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../shared/services/auth.service';
import { TaskService } from '../../shared/services/task.service';
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
  buttonLinkClassLight: string = '';
  username: string = '';
  password: string = '';
  passwordVisible: boolean = false;
  passwordIcon = 'assets/icons/lock.svg';
  private guestLoginSubscription!: Subscription;

  constructor(
    private authService: AuthService,
    private router: Router,
    private actionService: ActionService,
    private taskService: TaskService
  ) {}

  ngOnInit(): void {
    this.setOffGuestLogin();
  }

  togglePasswordVisibility(): void {
    this.passwordVisible = !this.passwordVisible;
    this.passwordIcon = this.passwordVisible
      ? 'assets/icons/visibility_on.svg'
      : 'assets/icons/visibility_off.svg';
  }

  onPasswordFocus(): void {
    this.passwordIcon = 'assets/icons/visibility_off.svg';
  }

  onPasswordBlur(): void {
    this.passwordVisible = false;
    this.passwordIcon = 'assets/icons/lock.svg';
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

  setOffGuestLogin(): void {
    this.guestLoginSubscription = this.actionService.guestLoginEvent.subscribe(
      () => {
        this.guestLogin();
      }
    );
  }

  guestLogin(): void {
    this.authService.guestLogin().subscribe({
      next: () => {
        console.log('Guest Login erfolgreich!');
        // this.taskService.fetchTasks();
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
