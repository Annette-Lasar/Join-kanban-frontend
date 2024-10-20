import { Component, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../../shared/components/navbar/navbar.component';
import { HeaderComponent } from '../../shared/components/header/header.component';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { RouterLink } from '@angular/router';
import { InfoComponent } from '../../shared/components/info/info.component';
import { OutsideClickDirective } from '../../shared/directives/outside-click.directive';

@Component({
  selector: 'join-board',
  standalone: true,
  imports: [
    CommonModule,
    HeaderComponent,
    NavbarComponent,
    ButtonComponent,
    RouterLink,
    InfoComponent,
    OutsideClickDirective,
  ],
  templateUrl: './board.component.html',
  styleUrl: './board.component.scss',
})
export class BoardComponent {
  isFocused = false;
  isContainerVisible = false;
  message: string = '';

  @ViewChild('searchInput') searchInput!: ElementRef<HTMLInputElement>;

  leaveSearchInputFocus() {
    this.toggleSearchIcon(false);
    this.clearSearch();
  }

  toggleSearchIcon(focus: boolean): void {
    this.isFocused = focus;
  }

  clearSearch(): void {
    this.searchInput.nativeElement.value = ''; 
  }

  toggleContainerVisibility(newMessage: string) {
    this.message = newMessage;
    this.isContainerVisible = !this.isContainerVisible;
  }

  hideContainer() {
    this.isContainerVisible = false;
  }
}
