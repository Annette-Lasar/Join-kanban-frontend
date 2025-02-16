import { Component, Input } from '@angular/core';
import { ButtonComponent } from '../button/button.component';
import { CommonModule } from '@angular/common';
import { Task } from '../../interfaces/task.interface';

@Component({
  selector: 'join-add-task-content',
  standalone: true,
  imports: [ButtonComponent, CommonModule],
  templateUrl: './add-task-content.component.html',
  styleUrl: './add-task-content.component.scss',
})
export class AddTaskContentComponent {
  @Input() task: Task | null = null;
  prioStatus: string = 'medium';
  isCategoryListVisible = false;
  isContactsListVisible = false;

  setPrioStatus(newStatus: string): void {
    this.prioStatus = newStatus;
  }

  prioChangeHandler(event: Event): void {
    // Implementiere die Logik für Prio-Änderungen
  }

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
