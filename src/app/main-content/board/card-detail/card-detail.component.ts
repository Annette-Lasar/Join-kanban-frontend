import {
  Component,
  Input,
  OnInit,
  OnDestroy,
  ChangeDetectorRef,
} from '@angular/core';
import { Task } from '../../../shared/interfaces/task.interface';
import { TaskDetailComponent } from './task-detail/task-detail.component';
import { TaskEditComponent } from './task-edit/task-edit.component';
import { Contact } from '../../../shared/interfaces/contact.interface';
import { Category } from '../../../shared/interfaces/category.interface';
import { Subscription } from 'rxjs';
import { ButtonPropertyService } from '../../../shared/services/button-propertys.service';
import { ActionService } from '../../../shared/services/action.service';
import { TaskStatusService } from '../../../shared/services/task-status.service';
import { TaskService } from '../../../shared/services/task.service';

@Component({
  selector: 'join-card-detail',
  standalone: true,
  imports: [TaskDetailComponent, TaskEditComponent],
  templateUrl: './card-detail.component.html',
  styleUrl: './card-detail.component.scss',
})
export class CardDetailComponent implements OnInit, OnDestroy {
  @Input() task: Task | null = null;
  @Input() contacts: Contact[] = [];
  @Input() categories: Category[] = [];
  editMode: boolean = false;
  private subscriptions = new Subscription();

  constructor(
    private buttonPropertyService: ButtonPropertyService,
    private actionService: ActionService,
    private taskStatusService: TaskStatusService,
    private taskService: TaskService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.getUpdatedEditMode();
    this.listenToOriginalTaskState();
    this.cancelEdit();
    this.cdr.detectChanges();
  }

  getUpdatedEditMode() {
    const getUpdatedDetailMode =
      this.buttonPropertyService.taskEditModeSubject$.subscribe((status) => {
        this.editMode = status;
      });
    this.subscriptions.add(getUpdatedDetailMode);
  }


  // Wozu brauche ich diese Methode??
  listenToOriginalTaskState(): void {
    const subscription =
      this.taskStatusService.originalTaskStateSubject$.subscribe(
        (originalTask) => {
          if (!this.task) return;
          console.log('Orginialzustand einer Aufgabe geladen: ', originalTask);
        }
      );
    this.subscriptions.add(subscription);
  }

  cancelEdit(): void {
    const subscription = this.actionService.closeEditModeEvent.subscribe(() => {
      const originalTask = this.taskStatusService.getOriginalTaskStatus();
      this.taskService.clearAssignedContacts(); 
      
      if (originalTask) {
        this.task = null;
        setTimeout(() => {
          this.task = JSON.parse(JSON.stringify(originalTask));
          if (this.task) {
            this.taskService.restoreOriginalTask(this.task);
          }
        }, 0);
      }
    });
    this.subscriptions.add(subscription);
  }



  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
