import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login/login.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { LegalLinksComponent } from '../shared/components/legal-links/legal-links.component';

@Component({
  selector: 'join-welcome',
  standalone: true,
  imports: [CommonModule, LoginComponent, SignUpComponent, LegalLinksComponent],
  templateUrl: './welcome.component.html',
  styleUrl: './welcome.component.scss',
})
export class WelcomeComponent {
  showLogin: boolean = true;

  onToggleShowLogin(show: boolean) {
    this.showLogin = show;
  }
}
