import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ActionService } from '../../services/action.service';

@Component({
  selector: 'join-button',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './button.component.html',
  styleUrl: './button.component.scss',
})
export class ButtonComponent {
  @Input() caption: string = '';
  @Input() buttonClass: string = '';
  @Input() padding: string = '1em 1.5em';
  @Input() width: string = '75px';
  @Input() height: string = '75px';
  @Input() imgSrc: string = '';
  @Input() imgClass: string = '';
  @Input() buttonIcon: boolean = false;
  @Input() buttonCaptionFirst: boolean = false;
  @Input() buttonCaptionSecond: boolean = false;
  @Input() prioClass: string = '';
  @Input() isPrioButton: boolean = false;
  @Input() buttonColor: string = '';
  @Input() alt: string = '';
  @Input() routerLink: string | null = null;
  @Input() tooltip: string = '';
  @Input() infoMessage: string = '';
  @Input() defaultSrc: string = '';
  @Input() activeSrc: string = '';
  @Input() type: 'button' | 'submit' = 'button';
  @Input() prioStatus: string = '';
  @Input() actionType: string = '';
  @Input() id?: number;
  @Input() actionFunction: (
    event: Event,
    actionType?: string,
    message?: string,
    id?: number
  ) => void = (event, actionType, message, id) => {
    event.stopPropagation();
    this.actionService.executeAction(actionType!, id, message);
  };


  @Output() toggleContainer = new EventEmitter<string>();
  @Output() isAddContactButtonClicked = new EventEmitter<void>();
  @Output() isContactDetailOptionsButtonClicked = new EventEmitter<void>();
  @Output() isEditContactButtonClicked = new EventEmitter<void>();
  @Output() createNewContactClicked = new EventEmitter<void>();
  @Output() clearInputButtonClicked = new EventEmitter<void>();
  @Output() deleteContactButtonClicked = new EventEmitter<void>();
  @Output() successMessage = new EventEmitter<void>();

  constructor(
    private actionService: ActionService
  ) {}

  setPrioStatus(newStatus: string) {
    this.prioStatus = newStatus;
  }

  get isPrioActive(): boolean {
    return this.prioStatus === this.caption.toLowerCase();
  }
}
