import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { LogoutMenuComponent } from '../logout-menu/logout-menu.component';
import { LocalStorageService } from '../../services/local-storage.service';
import { CheckIfLoggedInService } from '../../services/check-if-logged-in.service';
import { HeaderStatusService } from '../../services/header-status.service';
import { Subscription } from 'rxjs';
import { OutsideClickDirective } from '../../directives/outside-click.directive';

@Component({
  selector: 'join-header',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    LogoutMenuComponent,
    OutsideClickDirective,
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent implements OnInit, OnDestroy {
  isMenuVisible: boolean = false;
  userInitials: string = '';
  isLoggedIn: boolean = false;
  subscriptions = new Subscription();

  constructor(
    private localStorageService: LocalStorageService,
    private checkIfLoggedInService: CheckIfLoggedInService,
    private headerStatusService: HeaderStatusService,
  ) {}

  ngOnInit(): void {
    this.getUserInitials();
    this.isLoggedIn = this.checkIfLoggedInService.checkIfLoggedIn();
    this.subscribeToHeaderContextMenuStatus();
  }

  getUserInitials(): void {
    const userType = this.localStorageService.getUserTypeFromLocalStorage();

    if (userType === 'Guest') {
      this.userInitials = 'G';
      return;
    }

    const firstName =
      this.localStorageService.getUserFirstNameFromLocalStorage();
    const lastName = this.localStorageService.getUserLastNameFromLocalStorage();

    const firstInitial = firstName.charAt(0).toUpperCase();
    const lastInitial = lastName ? lastName.charAt(0).toUpperCase() : '';

    this.userInitials = `${firstInitial}${lastInitial}`;
  }

  subscribeToHeaderContextMenuStatus(): void {
    const subscription =
      this.headerStatusService.headerContextMenuStatus$.subscribe((status) => {
        this.isMenuVisible = status;
      });
    this.subscriptions.add(subscription);
  }

  toggleHeaderMenu() {
    this.headerStatusService.setHeaderContextMenuStatus(!this.isMenuVisible);
  }

  closeHeaderMenu() {
    this.headerStatusService.setHeaderContextMenuStatus(false);
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
