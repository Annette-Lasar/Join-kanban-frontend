import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { FormsModule, NgForm } from '@angular/forms';
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
  buttonLinkClassLight: string = '';
  username: string = '';
  password: string = '';
  errorMessage: string = '';
  passwordVisible: boolean = false;
  passwordIcon: string = 'assets/icons/lock.svg';
  
  private subscriptions: Subscription = new Subscription();

  constructor(
    private authService: AuthService,
    private router: Router,
    private actionService: ActionService
  ) {}

  ngOnInit(): void {
    this.setOffGuestLogin();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
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

  onSubmitLogin(loginForm: NgForm): void {
    if (!this.username || !this.password) return;

    this.verifyUserInformation(loginForm);
  }


    verifyUserInformation(loginForm: NgForm) {
      this.authService.login(this.username, this.password).subscribe({
        next: () => {
          this.router.navigate(['/main-content/summary']);
        },
        error: (err) => {
          console.error('Login failed:', err);
          this.errorMessage = err.error.error;
    
          setTimeout(() => {
            loginForm.resetForm();
          }, 2000);
        },
      });
    }
    

  setOffGuestLogin(): void {
    const subscription = this.actionService.guestLoginEvent.subscribe(() => {
      this.guestLogin();
    });
    this.subscriptions.add(subscription);
  }

  guestLogin(): void {
    this.authService.guestLogin().subscribe({
      next: () => {
        this.router.navigate(['/main-content/summary']);
      },
      error: (err) => {
        console.error('Guest login failed:', err);
      },
    });
  }

  clearErrorMessage(): void {
    this.errorMessage = '';
  }


}
