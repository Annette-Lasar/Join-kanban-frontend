import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { HeaderComponent } from '../../shared/components/header/header.component';
import { NavbarComponent } from '../../shared/components/navbar/navbar.component';
import { UserGreetingComponent } from './user-greeting/user-greeting.component';

@Component({
  selector: 'join-summary',
  standalone: true,
  imports: [RouterLink, HeaderComponent, NavbarComponent, UserGreetingComponent],
  templateUrl: './summary.component.html',
  styleUrl: './summary.component.scss',
})
export class SummaryComponent {}
