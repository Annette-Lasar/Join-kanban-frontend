import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  Output,
  OnInit,
  OnDestroy,
} from '@angular/core';
import { ButtonComponent } from '../button/button.component';
import { InfoBoxService } from '../../services/info-box.service';
import { InfoMessage } from '../../interfaces/info-message.interface';
import { Subscription } from 'rxjs';

@Component({
  selector: 'join-info',
  standalone: true,
  imports: [CommonModule, ButtonComponent],
  templateUrl: './info.component.html',
  styleUrl: './info.component.scss',
})
export class InfoComponent implements OnInit, OnDestroy {
  @Output() close = new EventEmitter<void>();

  infoMessage: InfoMessage | null = null;

  private subscriptions: Subscription = new Subscription();

  constructor(private infoBoxService: InfoBoxService) {}

  ngOnInit(): void {
    this.subscribeToInfoBox();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  subscribeToInfoBox(): void {
    const subscription = this.infoBoxService.infoBoxSubject$.subscribe(
      (message) => {
        this.infoMessage = message;
        console.log(
          '%cInfoComponent updated: ',
          'color: orchid;',
          this.infoMessage
        );
      }
    );
    this.subscriptions.add(subscription);
  }

  closeInfoBox(): void {
    this.close.emit();
  }

  onConfirmDelete(): void {
    console.log('%c OK-Button in InfoComponent geklickt!', 'color: red;');
    this.infoBoxService.triggerDelete();
  }
}
