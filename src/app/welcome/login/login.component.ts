import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { LegalLinksComponent } from '../../shared/components/legal-links/legal-links.component';

@Component({
  selector: 'join-login',
  standalone: true,
  imports: [CommonModule, RouterLink, ButtonComponent, LegalLinksComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  @Output() toggleLogIn = new EventEmitter<boolean>();
  buttonLinkClassLight: string = '';

  onSignUpClick() {
    this.toggleLogIn.emit(false);
  }
}
