import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ButtonComponent } from '../button/button.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'join-context-menu',
  standalone: true,
  imports: [CommonModule, ButtonComponent],
  templateUrl: './context-menu.component.html',
  styleUrl: './context-menu.component.scss',
})
export class ContextMenuComponent {
  @Input() contactDetailFormStatus: boolean = false;
 

  @Output() isEditFormStatusChanged = new EventEmitter<boolean>();

  changeFormMode() {
    this.isEditFormStatusChanged.emit(false);
  }


}
