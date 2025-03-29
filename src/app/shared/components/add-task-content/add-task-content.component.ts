import {
  Component,
  Input,
  OnInit,
  OnDestroy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonComponent } from '../button/button.component';
import { CategoriesDropdownComponent } from '../dropdown-lists/categories-dropdown/categories-dropdown.component';
import { ContactsDropdownComponent } from '../dropdown-lists/contacts-dropdown/contacts-dropdown.component';
import { Task } from '../../interfaces/task.interface';
import { Category } from '../../interfaces/category.interface';
import { Contact } from '../../interfaces/contact.interface';
import { SubtasksComponent } from '../subtasks/subtasks.component';
import { TaskService } from '../../services/task.service';
import { TaskCreationService } from '../../services/task-creation.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'join-add-task-content',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ButtonComponent,
    CategoriesDropdownComponent,
    ContactsDropdownComponent,
    SubtasksComponent,
  ],
  templateUrl: './add-task-content.component.html',
  styleUrl: './add-task-content.component.scss',
})
export class AddTaskContentComponent implements OnInit, OnDestroy {
  @Input() task: Task | null = null;
  @Input() categories: Category[] = [];
  @Input() contacts: Contact[] = [];
  @Input() isNewTask: boolean = false;
  
  prioStatus: string = 'medium';
  isCategoryListVisible = false;
  isContactsListVisible = false;
  today: string = new Date().toISOString().split('T')[0];
  title = '';
  description = '';
  due_date = '';
  
  private subscriptions: Subscription = new Subscription();


  constructor(
    private taskService: TaskService,
    private taskCreationService: TaskCreationService) {}

  ngOnInit(): void {
    this.subscribeToNewTask();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  subscribeToNewTask(): void {
    const subscription = this.taskCreationService.newTask$.subscribe(
      (newTask) => {
        this.title = newTask.title ?? '';
        this.description = newTask.description ?? '';
        this.due_date = newTask.due_date ?? '';
        this.prioStatus = newTask.priority ?? 'medium';
      }
    );
    this.subscriptions.add(subscription);
  }

  setPrioStatus(newStatus: string): void {
    this.prioStatus = newStatus;
  }


    updateTaskData(): void {
      const trimmedTitle = this.title.trim();
      const isValidTitle = trimmedTitle.length > 2;
      const isValidDueDate = !!this.due_date;
      
      this.taskService.setTitleIsValid(isValidTitle); 
      this.taskService.setDueDateIsValid(isValidDueDate);
    
      this.taskCreationService.updateNewTask({
        title: trimmedTitle,
        description: this.description,
        due_date: this.due_date,
        priority: this.prioStatus,
      });
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
