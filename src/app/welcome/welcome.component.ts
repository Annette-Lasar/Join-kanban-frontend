import { Component } from '@angular/core';
import { LoginComponent } from './login/login.component';
import { SignUpComponent } from './sign-up/sign-up.component';

@Component({
  selector: 'join-welcome',
  standalone: true,
  imports: [LoginComponent, SignUpComponent],
  templateUrl: './welcome.component.html',
  styleUrl: './welcome.component.scss',
})
export class WelcomeComponent {
  showLogin: boolean = true;
}
