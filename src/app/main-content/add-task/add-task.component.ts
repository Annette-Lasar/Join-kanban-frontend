import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgModel, NgForm } from '@angular/forms';
import { AddTaskContentComponent } from '../../shared/components/add-task-content/add-task-content.component';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { DataLoaderService } from '../../shared/services/data-loader.service';
import { TaskService } from '../../shared/services/task.service';
import { CategoryService } from '../../shared/services/category.service';
import { ContactService } from '../../shared/services/contact.service';
import { TaskCreationService } from '../../shared/services/task-creation.service';
import { ActionService } from '../../shared/services/action.service';
import { Task } from '../../shared/interfaces/task.interface';
import { Category } from '../../shared/interfaces/category.interface';
import { Contact } from '../../shared/interfaces/contact.interface';
import { forkJoin, Subscription } from 'rxjs';

@Component({
  selector: 'join-add-task',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    AddTaskContentComponent,
    ButtonComponent,
  ],
  templateUrl: './add-task.component.html',
  styleUrl: './add-task.component.scss',
})
export class AddTaskComponent implements OnInit, OnDestroy {
  tasks: Task[] = [];
  categories: Category[] = [];
  contacts: Contact[] = [];
  newTask: Partial<Task> = {};
  selectedCategory: Category | null = null;
  isFormValid: boolean = false;
  subscriptions = new Subscription();
  isDesktop: boolean = false;
  private resizeObserver!: ResizeObserver;

  constructor(
    private dataLoaderService: DataLoaderService,
    private taskService: TaskService,
    private categoryService: CategoryService,
    private contactService: ContactService,
    private taskCreationService: TaskCreationService,
    private cdr: ChangeDetectorRef,
    private actionService: ActionService
  ) {}

  ngOnInit(): void {
    this.loadAllData();
    this.initializeResizeObserver();
    this.subscribeToSelectedCategory();
    this.subscribeToAssignedContacts();
    this.subscribeToResetNewTaskEvent();
  }

  loadAllData(): void {
    this.subscriptions.add(
      forkJoin({
        categories: this.dataLoaderService.loadCategories(),
        contacts: this.dataLoaderService.loadContacts(),
      }).subscribe({
        next: ({ categories, contacts }) => {
          this.categories = categories;
          this.contacts = contacts;
        },
        error: (err) => console.error('Error loading data: ', err),
      })
    );
  }

  initializeResizeObserver(): void {
    this.resizeObserver = new ResizeObserver(() => {
      this.isDesktop = window.innerWidth > 800;
      this.cdr.detectChanges();
    });
    this.resizeObserver.observe(document.body);
    this.isDesktop = window.innerWidth > 800;
  }

  subscribeToSelectedCategory(): void {
    const subscription = this.taskService.selectedCategorySubject$.subscribe(
      (category) => {
        if (category) {
          this.newTask = { ...this.newTask, category };
        }
      }
    );
    this.subscriptions.add(subscription);
  }

  subscribeToAssignedContacts(): void {
    const subscription = this.taskService.assignedContactsSubject$.subscribe(
      (contacts) => {
        this.newTask = { ...this.newTask, contacts };
      }
    );
    this.subscriptions.add(subscription);
  }

  onTaskDataChange(
    updatedData: Partial<{
      title: string;
      description: string;
      due_date: string;
      priority: string;
    }>
  ) {
    this.newTask = { ...this.newTask, ...updatedData };
  }

  subscribeToResetNewTaskEvent(): void {
    const subscription = this.actionService.resetNewTaskEvent.subscribe(() => {
      this.resetNewTask();
    });
    this.subscriptions.add(subscription);
  }

  resetNewTask(): void {
    this.taskCreationService.clearNewTask();
    this.taskService.setSelectedCategory(null);
    this.taskService.clearAssignedContacts();
    this.taskService.setAssignedSubtasks([]);
  }

  onSubmit(): void {
    const taskData = this.taskCreationService.getCurrentTask();

    if (!taskData.title?.trim()) {
      console.error('Fehler: Titel fehlt!');
      return;
    }

    this.taskCreationService.startTaskCreation('toDo', taskData);
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
    this.resizeObserver.disconnect();
  }
}
