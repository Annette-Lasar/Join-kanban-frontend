import { Component } from '@angular/core';
import { NavbarComponent } from '../../shared/components/navbar/navbar.component';
import { HeaderComponent } from '../../shared/components/header/header.component';

@Component({
  selector: 'join-board',
  standalone: true,
  imports: [HeaderComponent, NavbarComponent],
  templateUrl: './board.component.html',
  styleUrl: './board.component.scss'
})
export class BoardComponent {

}
