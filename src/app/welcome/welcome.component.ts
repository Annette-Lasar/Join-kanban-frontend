import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login/login.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { InfoComponent } from '../shared/components/info/info.component';
import { LegalLinksComponent } from '../shared/components/legal-links/legal-links.component';
import { ButtonPropertyService } from '../shared/services/button-propertys.service';
import { Observable, Subscription } from 'rxjs';

@Component({
  selector: 'join-welcome',
  standalone: true,
  imports: [
    CommonModule,
    LoginComponent,
    SignUpComponent,
    LegalLinksComponent,
    InfoComponent,
  ],
  templateUrl: './welcome.component.html',
  styleUrl: './welcome.component.scss',
})
export class WelcomeComponent implements OnInit, OnDestroy {
  loginStatus: boolean = true;
  showSuccessMessage: boolean = false;
  subscriptions = new Subscription();

  constructor(private buttonPropertyService: ButtonPropertyService) {}

  ngOnInit(): void {
    this.getUpdatedLoginStatus();
  }

  getUpdatedLoginStatus(): void {
    const subscription = this.buttonPropertyService.loginStatus$.subscribe(
      (status) => {
        this.loginStatus = status;
      }
    );
    this.subscriptions.add(subscription);
  }

  onRegistrationSuccess(): void {
    this.showSuccessMessage = true;
    setTimeout(() => {
      this.showSuccessMessage = false;
    }, 2000);
  }

  /*   onToggleShowLogin(show: boolean) {
    this.showLogin = show;
  } */

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
