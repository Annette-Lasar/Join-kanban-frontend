import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { HeaderComponent } from '../shared/components/header/header.component';
import { NavbarComponent } from '../shared/components/navbar/navbar.component';

@Component({
  selector: 'join-help-user',
  standalone: true,
  imports: [HeaderComponent, NavbarComponent, RouterLink],
  templateUrl: './help-user.component.html',
  styleUrl: './help-user.component.scss'
})
export class HelpUserComponent {

}
