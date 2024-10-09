import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LegalLinksComponent } from '../legal-links/legal-links.component';

@Component({
  selector: 'join-navbar',
  standalone: true,
  imports: [RouterLink, LegalLinksComponent],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {

}
