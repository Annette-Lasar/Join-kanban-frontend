import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonComponent } from '../button/button.component';
import { CategoriesDropdownComponent } from '../dropdown-lists/categories-dropdown/categories-dropdown.component';
import { ContactsDropdownComponent } from '../dropdown-lists/contacts-dropdown/contacts-dropdown.component';
import { Task } from '../../interfaces/task.interface';
import { Category } from '../../interfaces/category.interface';
import { Contact } from '../../interfaces/contact.interface';
import { SubtasksComponent } from '../subtasks/subtasks.component';

@Component({
  selector: 'join-add-task-content',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ButtonComponent,
    CategoriesDropdownComponent,
    ContactsDropdownComponent,
    SubtasksComponent
  ],
  templateUrl: './add-task-content.component.html',
  styleUrl: './add-task-content.component.scss',
})
export class AddTaskContentComponent {
  @Input() task: Task | null = null;
  @Input() categories: Category[] = [];
  @Input() contacts: Contact[] = [];
  prioStatus: string = 'medium';
  isCategoryListVisible = false;
  isContactsListVisible = false;
  today: string = new Date().toISOString().split('T')[0];
  title = '';
  description = '';
  due_date = '';

  @Output() taskDataChange = new EventEmitter<{
    title: string;
    description: string;
    due_date: string;
    priority: string;
  }>();

  setPrioStatus(newStatus: string): void {
    this.prioStatus = newStatus;
    console.log('aktueller Prio-Status: ', this.prioStatus);
  }

  emitTaskData() {
    this.taskDataChange.emit({
      title: this.title,
      description: this.description,
      due_date: this.due_date,
      priority: this.prioStatus,
    });
  }

  /*   prioChangeHandler(event: Event): void {
    // Implementiere die Logik für Prio-Änderungen
    // Brauche ich das? In der TaskEditComponent ging es auch ohne.
  } */

  toggleCategoryList(event: Event): void {
    event.stopPropagation();
    this.isCategoryListVisible = !this.isCategoryListVisible;
  }

  toggleContactsList(event: Event): void {
    event.stopPropagation();
    this.isContactsListVisible = !this.isContactsListVisible;
  }

  closeCategoryList(): void {
    this.isCategoryListVisible = false;
  }
}
