import { Component, Input } from '@angular/core';
import { Task } from '../../../shared/interfaces/task.interface';
import { TaskDetailComponent } from './task-detail/task-detail.component';
import { TaskEditComponent } from './task-edit/task-edit.component';
import { ButtonComponent } from '../../../shared/components/button/button.component';

@Component({
  selector: 'join-card-detail',
  standalone: true,
  imports: [TaskDetailComponent, TaskEditComponent, ButtonComponent],
  templateUrl: './card-detail.component.html',
  styleUrl: './card-detail.component.scss',
})
export class CardDetailComponent {
  @Input() task: Task | null = null;
  detailMode: boolean = true;

  toggleEditMode(): void {
    this.detailMode = !this.detailMode;
  }
}
