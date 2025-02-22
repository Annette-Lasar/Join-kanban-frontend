import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { Task } from '../../../../shared/interfaces/task.interface';
import { ButtonComponent } from '../../../../shared/components/button/button.component';
import { SubtasksComponent } from '../../../../shared/components/subtasks/subtasks.component';
import { CommonModule } from '@angular/common';
import { CategoriesDropdownComponent } from '../../../../shared/components/dropdown-lists/categories-dropdown/categories-dropdown.component';
import { ContactsDropdownComponent } from '../../../../shared/components/dropdown-lists/contacts-dropdown/contacts-dropdown.component';
import { Contact } from '../../../../shared/interfaces/contact.interface';
import { Category } from '../../../../shared/interfaces/category.interface';
import { TaskStatusService } from '../../../../shared/services/task-status.service';
import { ActionService } from '../../../../shared/services/action.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'join-task-edit',
  standalone: true,
  imports: [
    CommonModule,
    ButtonComponent,
    SubtasksComponent,
    CategoriesDropdownComponent,
    ContactsDropdownComponent,
  ],
  templateUrl: './task-edit.component.html',
  styleUrl: './task-edit.component.scss',
})
export class TaskEditComponent implements OnInit, OnDestroy {
  @Input() task: Task | null = null;
  @Input() contacts: Contact[] = [];
  @Input() categories: Category[] = [];
  pathPrefix: string = 'assets/icons/prio_';
  prioStatus: string = 'medium';
  today: string = new Date().toISOString().split('T')[0];
  private subscriptions = new Subscription();

  constructor(
    private taskStatusService: TaskStatusService,
    private actionService: ActionService
  ) {}

  ngOnInit(): void {
    // this.listenToOriginalTaskState();
    // this.cancelEdit();
  }



  setPrioStatus(status: string) {
    this.prioStatus = status;
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
