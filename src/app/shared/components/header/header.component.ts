import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LogoutMenuComponent } from '../logout-menu/logout-menu.component';

@Component({
  selector: 'join-header',
  standalone: true,
  imports: [RouterLink, LogoutMenuComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {

}
