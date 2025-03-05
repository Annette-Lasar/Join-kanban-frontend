import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { ButtonComponent } from '../button/button.component';
import { ContactStatusService } from '../../services/contact-status.service';
import { InfoBoxService } from '../../services/info-box.service';

@Component({
  selector: 'join-info',
  standalone: true,
  imports: [CommonModule, ButtonComponent],
  templateUrl: './info.component.html',
  styleUrl: './info.component.scss',
})
export class InfoComponent {
  @Input() securityQuestion: boolean = false;
  @Input() textAndIcon: boolean = false;
  @Input() alertTitle: string = '';
  @Input() infoQuestion: string = '';
  @Input() infoText: string = '';
  @Input() infoMessageClass: string = '';
  @Input() imageSrc: string = '';
  @Input() imageSrc2: string = '';
  @Input() actionType!: string;
  @Input() caption1: string = '';
  @Input() caption2: string = '';
  @Input() id?: number;

  @Output() close = new EventEmitter<void>();

  constructor(private infoBoxService: InfoBoxService) {}

  closeInfoBox(): void {
    this.close.emit();
  }

  onConfirmDelete(): void {
    console.log('%c OK-Button in InfoComponent geklickt!', 'color: red;');
    this.infoBoxService.triggerDelete();
  }
}
