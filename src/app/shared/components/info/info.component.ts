import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { ButtonComponent } from '../button/button.component';
import { ContactStatusService } from '../../services/contact-status.service';

@Component({
  selector: 'join-info',
  standalone: true,
  imports: [CommonModule, ButtonComponent],
  templateUrl: './info.component.html',
  styleUrl: './info.component.scss',
})
export class InfoComponent implements OnInit {
  isInfoBoxPresent: boolean = false;

  @Input() isSuccessMessageVisible: boolean = false;
  @Input() textAndIcon: boolean = false;
  @Input() securityQuestion: boolean = false;
  @Input() alertTitle: string = '';
  @Input() infoQuestion: string = '';
  @Input() infoText: string = '';
  @Input() infoMessageClass: string = '';
  @Input() imageSrc: string = '';
  @Input() imageSrc2: string = '';

  constructor(private contactStatusService: ContactStatusService) {}

  ngOnInit(): void {
    this.updateIsInfoBoxPresent();
  }

  updateIsInfoBoxPresent(): void {
    this.contactStatusService.infoBoxStatus$.subscribe((status) => {
      this.isInfoBoxPresent = status;
    });
  }

  closeInfoBox(): void {
    this.contactStatusService.setInfoBoxStatus(false);
  }
}
