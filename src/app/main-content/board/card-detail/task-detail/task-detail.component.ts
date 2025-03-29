import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from '../../../../shared/components/button/button.component';
import { Task } from '../../../../shared/interfaces/task.interface';
import { Subtask } from '../../../../shared/interfaces/task.interface';
import { TextFormatterService } from '../../../../shared/services/text-formatter.service';
import { FormsModule } from '@angular/forms';
import { TaskService } from '../../../../shared/services/task.service';
import { TaskStatusService } from '../../../../shared/services/task-status.service';
import { ActionService } from '../../../../shared/services/action.service';
import { InfoBoxService } from '../../../../shared/services/info-box.service';
import { ButtonPropertyService } from '../../../../shared/services/button-propertys.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'join-task-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, ButtonComponent],
  templateUrl: './task-detail.component.html',
  styleUrl: './task-detail.component.scss',
})
export class TaskDetailComponent implements OnInit, OnDestroy {
  @Input() task: Task | null = null;
  pathPrefix: string = 'assets/icons/prio_';
  isWarningMessageVisible: boolean = false;
  private subscriptions: Subscription = new Subscription();

  constructor(
    private textFormatterService: TextFormatterService,
    private taskService: TaskService,
    private actionService: ActionService,
    private taskStatusService: TaskStatusService,
    private infoBoxService: InfoBoxService,
    private buttonPropertyService: ButtonPropertyService
  ) {}

  ngOnInit(): void {
    this.getUpdatedTasksSubject();
    this.listenForOriginalTaskStatusEvent();
    this.subscribeToDeleteTaskEvent();
    this.getUpdatedWarningBoxStatus();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  getUpdatedTasksSubject() {
    const subscription = this.taskService.tasks$.subscribe((tasks) => {
      if (this.task) {
        this.task = tasks.find((task) => task.id === this.task!.id) || null;
      }
    });
    this.subscriptions.add(subscription);
  }


  subscribeToDeleteTaskEvent(): void {
    const subscription = this.actionService.deleteTaskEvent.subscribe((id) => {
      this.deleteTask(id);
    });
    this.subscriptions.add(subscription);
  }

 
  listenForOriginalTaskStatusEvent(): void {
    const subscription =
      this.actionService.keepOriginalTaskStatusEvent.subscribe(() => {
        if (this.task) {
          this.taskStatusService.setOriginalTaskStatus(this.task);
        }
      });
    this.subscriptions.add(subscription);
  }

  formatPriorityStatus(text: string): string {
    return this.textFormatterService.formatPriorityName(text);
  }

  onSubtaskChange(taskId: number, subtask: Subtask): void {
    this.taskService.updateSubtaskStatus(taskId, subtask);
  }

  getUpdatedWarningBoxStatus(): void {
    const subscription = this.infoBoxService.infoBoxStatus$.subscribe(
      (status) => {
        this.isWarningMessageVisible = status;
      }
    );
    this.subscriptions.add(subscription);
  }


  deleteTask(id: number): void {
    this.taskService.removeTaskFromUI(id);
    this.taskService.deleteTaskFromBackend(id);

    this.closeWarningBox();
    this.closeDetailView();
  }

  closeWarningBox(): void {
    this.infoBoxService.setInfoBoxStatus(false);
    this.getUpdatedWarningBoxStatus();
  }

  closeDetailView(): void {
    this.buttonPropertyService.setIsTaskDetailVisibleStatusSubject(false);
  }


}
