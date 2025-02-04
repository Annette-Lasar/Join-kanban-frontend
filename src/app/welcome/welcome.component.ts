import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login/login.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { LegalLinksComponent } from '../shared/components/legal-links/legal-links.component';
import { ButtonPropertyService } from '../shared/services/button-propertys.service';

@Component({
  selector: 'join-welcome',
  standalone: true,
  imports: [CommonModule, LoginComponent, SignUpComponent, LegalLinksComponent],
  templateUrl: './welcome.component.html',
  styleUrl: './welcome.component.scss',
})
export class WelcomeComponent implements OnInit {
  loginStatus: boolean = true;

  constructor(private buttonPropertyService: ButtonPropertyService) {}

  ngOnInit(): void {
    this.getUpdatedLoginStatus();
  }

  getUpdatedLoginStatus(): void {
    this.buttonPropertyService.loginStatus$.subscribe((status) => {
      this.loginStatus = status;
    });
  }

  /*   onToggleShowLogin(show: boolean) {
    this.showLogin = show;
  } */
}
