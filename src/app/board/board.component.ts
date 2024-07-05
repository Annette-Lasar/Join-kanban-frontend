import { Component } from '@angular/core';
import { HeaderContentComponent } from '../shared/components/header-content/header-content.component';
import { NavbarComponent } from '../shared/components/navbar/navbar.component';

@Component({
  selector: 'join-board',
  standalone: true,
  imports: [HeaderContentComponent, NavbarComponent],
  templateUrl: './board.component.html',
  styleUrl: './board.component.scss'
})
export class BoardComponent {

}
