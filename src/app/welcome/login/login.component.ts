import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ButtonComponent } from '../../shared/components/button/button.component';

@Component({
  selector: 'join-login',
  standalone: true,
  imports: [CommonModule, RouterLink, ButtonComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  @Output() toggleLogIn = new EventEmitter<boolean>();
  buttonLinkClassLight: string = '';

/*   onSignUpClick() {
    this.toggleLogIn.emit(false);
  } */
}
