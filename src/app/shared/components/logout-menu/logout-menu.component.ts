import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { HeaderStatusService } from '../../services/header-status.service';

@Component({
  selector: 'join-logout-menu',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './logout-menu.component.html',
  styleUrl: './logout-menu.component.scss',
})
export class LogoutMenuComponent {
  @Input() menuItemCaption1: string = '';
  @Input() menuItemCaption2: string = '';
  @Input() menuItemCaption3: string = '';
  @Input() menuItemCaption4: string | undefined = '';
  @Input() boardListName: string | undefined = '';

  constructor(private authService: AuthService, private router: Router,
    private headerStatusService: HeaderStatusService
  ) {}

  logout() {
    this.authService.logout();
    this.router.navigate(['']);
    this.headerStatusService.setHeaderContextMenuStatus(false);
  }
}
