import { Component, Input } from '@angular/core';
import { Task } from '../../../shared/interfaces/task.interface';
import { TaskDetailComponent } from './task-detail/task-detail.component';
import { TaskEditComponent } from './task-edit/task-edit.component';
import { Contact } from '../../../shared/interfaces/contact.interface';
import { Category } from '../../../shared/interfaces/category.interface';


@Component({
  selector: 'join-card-detail',
  standalone: true,
  imports: [TaskDetailComponent, TaskEditComponent],
  templateUrl: './card-detail.component.html',
  styleUrl: './card-detail.component.scss',
})
export class CardDetailComponent {
  @Input() task: Task | null = null;
  @Input() contacts: Contact[] = [];
  @Input() categories: Category[] = [];
  detailMode: boolean = false;

  toggleEditMode(): void {
    this.detailMode = !this.detailMode;
  }
}
