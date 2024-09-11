import { Component } from '@angular/core';
import { HeaderComponent } from '../../shared/components/header/header.component';
import { NavbarComponent } from '../../shared/components/navbar/navbar.component';

@Component({
  selector: 'join-contacts',
  standalone: true,
  imports: [HeaderComponent, NavbarComponent],
  templateUrl: './contacts.component.html',
  styleUrl: './contacts.component.scss',
})
export class ContactsComponent {}
