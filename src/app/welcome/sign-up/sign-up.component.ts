import { Component, Output, EventEmitter } from '@angular/core';
import { ButtonComponent } from "../../shared/components/button/button.component";

@Component({
  selector: 'join-sign-up',
  standalone: true,
  imports: [ButtonComponent],
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.scss'
})
export class SignUpComponent {
@Output() toggleLogIn = new EventEmitter<boolean>();


/* onSignUpClick() {
  this.toggleLogIn.emit(true); 
} */

}
