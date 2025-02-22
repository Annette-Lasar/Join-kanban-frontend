import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { Task } from '../../interfaces/task.interface';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from '../button/button.component';
import { Subscription } from 'rxjs';
import { ActionService } from '../../services/action.service';
import { ButtonPropertyService } from '../../services/button-propertys.service';

@Component({
  selector: 'join-subtasks',
  standalone: true,
  imports: [CommonModule, ButtonComponent],
  templateUrl: './subtasks.component.html',
  styleUrl: './subtasks.component.scss',
})
export class SubtasksComponent implements OnInit, OnDestroy {
  @Input() task: Task | null = null;
  isCancelAddSubtaskVisible: boolean = false;

  subscriptions = new Subscription();

  constructor(
    private actionService: ActionService,
    private buttonPropertyService: ButtonPropertyService
  ) {}

  ngOnInit(): void {
    this.subscribeToToggleAddSubtaskBox();
  }

  subscribeToToggleAddSubtaskBox(): void {
    const subscription = this.actionService.addSubtaskEvent.subscribe(
      (message) => {
        this.buttonPropertyService.toggleCancelAddSubtaskVisible();
        this.takeFurtherAction(message);
        this.getNewSubtaskBoxStatus();
      }
    );
    this.subscriptions.add(subscription);
  }

  takeFurtherAction(message: string) {
    message === 'cancel'
      ? this.cancelSubtask()
      : message === 'save'
      ? this.saveSubtask()
      : null;
  }

  cancelSubtask(): void {
    // Code hier
  }

  saveSubtask(): void {
    // Code hier
  }

  getNewSubtaskBoxStatus() {
    const subscription =
      this.buttonPropertyService.isCancelAddSubtaskVisibleSubject$.subscribe(
        (status) => {
          this.isCancelAddSubtaskVisible = status;
        }
      );
    this.subscriptions.add(subscription);
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
