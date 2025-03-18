import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ActionService } from '../../services/action.service';
import { InfoBoxService } from '../../services/info-box.service';
import { BoardStatusService } from '../../services/board-status.service';

@Component({
  selector: 'join-button',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './button.component.html',
  styleUrl: './button.component.scss',
})
export class ButtonComponent {
  @Input() actionType: string = '';
  @Input() activeSrc: string = '';
  @Input() alt: string = '';
  @Input() buttonCaptionFirst: boolean = false;
  @Input() buttonCaptionSecond: boolean = false;
  @Input() buttonClass: string = '';
  @Input() buttonColor: string = '';
  @Input() buttonIcon: boolean = false;
  @Input() caption: string = '';
  @Input() defaultSrc: string = '';
  @Input() disabled: boolean = false;
  @Input() height: string = '75px';
  @Input() id?: number;
  @Input() imgClass: string = '';
  @Input() imgSrc: string = '';
  @Input() infoMessage: string = '';
  @Input() isPrioButton: boolean = false;
  @Input() padding: string = '1em 1.5em';
  @Input() prioClass: string = '';
  @Input() prioStatus: string = '';
  @Input() routerLink: string | null = null;
  @Input() tooltip: string = '';
  @Input() type: 'button' | 'submit' = 'button';
  @Input() width: string = '75px';

  @Input() actionFunction: (
    event: Event,
    actionType?: string,
    message?: string,
    id?: number
  ) => void = (event, actionType, message, id) => {
    event.stopPropagation();
    this.actionService.executeAction(actionType!, id, message, event);
  };

  @Output() toggleContainer = new EventEmitter<string>();
  @Output() isAddContactButtonClicked = new EventEmitter<void>();
  @Output() isContactDetailOptionsButtonClicked = new EventEmitter<void>();
  @Output() isEditContactButtonClicked = new EventEmitter<void>();
  @Output() createNewContactClicked = new EventEmitter<void>();
  @Output() clearInputButtonClicked = new EventEmitter<void>();
  @Output() deleteContactButtonClicked = new EventEmitter<void>();
  @Output() successMessage = new EventEmitter<void>();
  @Output() clicked = new EventEmitter<void>();

  constructor(
    private actionService: ActionService,
    private infoBoxService: InfoBoxService,
    private boardStatusService: BoardStatusService
  ) {}

  setPrioStatus(newStatus: string) {
    this.prioStatus = newStatus;
  }

  onClick(event: Event): void {
    if (!this.actionType) {
      console.warn('Kein actionType definiert!');
      return;
    }

    if (this.actionType === 'toggle') {
      const currentStatus =
        this.boardStatusService.boardSuccessStatus.getValue();
      this.boardStatusService.setBoardSuccessStatus(!currentStatus);
    }

    if (this.actionType === 'deleteTask') {
      this.infoBoxService.triggerDelete();
    }

    this.actionFunction(event, this.actionType, this.infoMessage, this.id);
  }

  get isPrioActive(): boolean {
    return this.prioStatus === this.caption.toLowerCase();
  }
}
