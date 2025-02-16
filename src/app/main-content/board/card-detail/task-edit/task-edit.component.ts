import { Component, Input } from '@angular/core';
import { Task } from '../../../../shared/interfaces/task.interface';
import { ButtonComponent } from '../../../../shared/components/button/button.component';
import { CommonModule, DatePipe } from '@angular/common';
import { CategoriesDropdownComponent } from '../../../../shared/components/dropdown-lists/categories-dropdown/categories-dropdown.component';
import { ContactsDropdownComponent } from '../../../../shared/components/dropdown-lists/contacts-dropdown/contacts-dropdown.component';
import { Contact } from '../../../../shared/interfaces/contact.interface';
import { Category } from '../../../../shared/interfaces/category.interface';

@Component({
  selector: 'join-task-edit',
  standalone: true,
  imports: [
    CommonModule,
    ButtonComponent,
    CategoriesDropdownComponent,
    ContactsDropdownComponent,
  ],
  templateUrl: './task-edit.component.html',
  styleUrl: './task-edit.component.scss',
})
export class TaskEditComponent {
  @Input() task: Task | null = null;
  @Input() contacts: Contact[] = [];
  @Input() categories: Category[] = [];
  pathPrefix: string = 'assets/icons/prio_';
  prioStatus: string = 'medium';
  today: string = new Date().toISOString().split('T')[0];

  constructor(private datePipe: DatePipe) {}

  setPrioStatus(status: string) {
    this.prioStatus = status;
  }
}
