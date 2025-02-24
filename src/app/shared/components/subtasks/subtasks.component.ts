import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { Subtask, Task } from '../../interfaces/task.interface';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonComponent } from '../button/button.component';
import { Subscription } from 'rxjs';
import { ActionService } from '../../services/action.service';
import { ButtonPropertyService } from '../../services/button-propertys.service';

@Component({
  selector: 'join-subtasks',
  standalone: true,
  imports: [CommonModule, FormsModule, ButtonComponent],
  templateUrl: './subtasks.component.html',
  styleUrl: './subtasks.component.scss',
})
export class SubtasksComponent implements OnInit, OnDestroy {
  @Input() task!: Task;
  isCancelAddSubtaskVisible: boolean = false;
  subtaskTitle: string = '';

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
      ({message, id, event}) => {
        console.log('event: ', event);
        this.handleSubtaskAction(message);
        this.subscribeToAddSubtaskBox();
      }
    );
    this.subscriptions.add(subscription);
  }

  handleSubtaskAction(message?: string) {
    switch (message) {
      case 'open':
        this.buttonPropertyService.setCancelAddSubtaskvisible(true);
        break;
      case 'cancel':
        this.cancelSubtask();
        this.buttonPropertyService.setCancelAddSubtaskvisible(false);
        break;
      case 'save':
        this.addSubtaskToList();
        this.buttonPropertyService.setCancelAddSubtaskvisible(false);
        break;
      default:
        console.log(`Unknown action: ${message}`);
    }
  }

  subscribeToAddSubtaskBox() {
    const subscription =
      this.buttonPropertyService.isCancelAddSubtaskVisibleSubject$.subscribe(
        (status) => {
          this.isCancelAddSubtaskVisible = status;
        }
      );
    this.subscriptions.add(subscription);
  }

  toggleAddSubtaskBox(status: boolean): void {
    this.buttonPropertyService.setCancelAddSubtaskvisible(status);
    this.subscribeToAddSubtaskBox();
  }

  cancelSubtask(): void {
    this.subtaskTitle = '';
  }

  addSubtaskToList(): void {
    const newSubtask: Subtask = {
      title: this.subtaskTitle.trim(),
      checked_status: false,
    };
    if (newSubtask.title !== '') {
      this.task.subtasks.push(newSubtask);
      console.log('Subtask in die Liste aufgenommen!');
      this.cancelSubtask();
    } else {
      console.log('Please enter a subtask title.');
    }
  }

  getNewSubtaskBoxStatus() {
    const subscription =
      this.buttonPropertyService.isCancelAddSubtaskVisibleSubject$.subscribe(
        (status) => {
          console.log('aktueller Status im Service: ', status);
          this.isCancelAddSubtaskVisible = status;
        }
      );
    this.subscriptions.add(subscription);
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
