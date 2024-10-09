import { Component, Output, EventEmitter } from '@angular/core';
import { LegalLinksComponent } from "../../shared/components/legal-links/legal-links.component";
import { ButtonComponent } from "../../shared/components/button/button.component";

@Component({
  selector: 'join-sign-up',
  standalone: true,
  imports: [LegalLinksComponent, ButtonComponent],
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.scss'
})
export class SignUpComponent {
@Output() toggleLogIn = new EventEmitter<boolean>();


onSignUpClick() {
  this.toggleLogIn.emit(true); 
}

}
