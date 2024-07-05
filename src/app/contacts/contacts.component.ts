import { Component } from '@angular/core';
import { HeaderContentComponent } from '../shared/components/header-content/header-content.component';
import { NavbarComponent } from '../shared/components/navbar/navbar.component';

@Component({
  selector: 'join-contacts',
  standalone: true,
  imports: [HeaderContentComponent, NavbarComponent],
  templateUrl: './contacts.component.html',
  styleUrl: './contacts.component.scss'
})
export class ContactsComponent {

}
