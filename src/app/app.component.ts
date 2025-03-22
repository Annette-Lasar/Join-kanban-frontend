import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { InfoComponent } from './shared/components/info/info.component';
import { InfoMessage } from './shared/interfaces/info-message.interface';
import { InfoBoxService } from './shared/services/info-box.service';
import { ActionService } from './shared/services/action.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'join-root',
  standalone: true,
  imports: [CommonModule, InfoComponent, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'join';

  infoMessage: InfoMessage | null = null;

  private subscriptions = new Subscription();

  constructor(
    private infoBoxService: InfoBoxService,
    private actionService: ActionService
  ) {}

  ngOnInit(): void {
    this.subscribeToInfoBoxEvent();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  subscribeToInfoBoxEvent(): void {
    const subscription = this.actionService.infoBoxEvent.subscribe(() => {
      this.subscribeToInfoBoxSubject();
    });
    this.subscriptions.add(subscription);
  }

  subscribeToInfoBoxSubject(): void {
    const subscription = this.infoBoxService.infoBoxSubject$.subscribe(
      (message) => {
        this.infoMessage = message;
      }
    );
    this.subscriptions.add(subscription);
  }
}
