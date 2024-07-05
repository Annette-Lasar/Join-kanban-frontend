import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NavbarComponent } from '../shared/components/navbar/navbar.component';
import { HeaderContentComponent } from '../shared/components/header-content/header-content.component';


@Component({
  selector: 'join-summary',
  standalone: true,
  imports: [RouterLink, NavbarComponent, HeaderContentComponent],
  templateUrl: './summary.component.html',
  styleUrl: './summary.component.scss'
})
export class SummaryComponent {

}
