import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'join-logout-menu',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './logout-menu.component.html',
  styleUrl: './logout-menu.component.scss',
})
export class LogoutMenuComponent {
  constructor(private authService: AuthService, private router: Router) {}

  logout() {
    this.authService.logout();
    console.log('Logout erfolgreich!');
    this.router.navigate(['']);
  }
}
