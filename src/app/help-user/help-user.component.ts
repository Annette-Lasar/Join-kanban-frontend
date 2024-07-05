import { Component } from '@angular/core';
import { HeaderContentComponent } from '../shared/components/header-content/header-content.component';
import { NavbarComponent } from '../shared/components/navbar/navbar.component';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'join-help-user',
  standalone: true,
  imports: [HeaderContentComponent, NavbarComponent, RouterLink],
  templateUrl: './help-user.component.html',
  styleUrl: './help-user.component.scss'
})
export class HelpUserComponent {

}
