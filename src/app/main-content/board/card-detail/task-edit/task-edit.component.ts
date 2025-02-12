import { Component, Input } from '@angular/core';
import { Task } from '../../../../shared/interfaces/task.interface';

@Component({
  selector: 'join-task-edit',
  standalone: true,
  imports: [],
  templateUrl: './task-edit.component.html',
  styleUrl: './task-edit.component.scss'
})
export class TaskEditComponent {
  @Input() task: Task | null = null;
}
