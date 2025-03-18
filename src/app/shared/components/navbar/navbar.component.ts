import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { LegalLinksComponent } from '../legal-links/legal-links.component';
import { CheckIfLoggedInService } from '../../services/check-if-logged-in.service';

@Component({
  selector: 'join-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, LegalLinksComponent],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent implements OnInit {
  isLoggedIn: boolean = false;

  constructor(private checkIfLoggedInService: CheckIfLoggedInService) {}

  ngOnInit(): void {
    this.isLoggedIn = this.checkIfLoggedInService.checkIfLoggedIn();
  }
}
