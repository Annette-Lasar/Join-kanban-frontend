import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { LogoutMenuComponent } from '../logout-menu/logout-menu.component';

@Component({
  selector: 'join-header',
  standalone: true,
  imports: [CommonModule, RouterLink, LogoutMenuComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  isMenuVisible = false;

  getUserInitials(): string {
    const userType = localStorage.getItem('userType') || 'Guest'; 

    if (userType === 'Guest') {
      return 'G'; 
    }

    const firstName = localStorage.getItem('userFirstName') || '';
    const lastName = localStorage.getItem('userLastName') || '';

    const firstInitial = firstName.charAt(0).toUpperCase();
    const lastInitial = lastName ? lastName.charAt(0).toUpperCase() : '';

    return `${firstInitial}${lastInitial}`;
  }

  toggleHeaderMenu() {
    this.isMenuVisible = !this.isMenuVisible;
  }
}
