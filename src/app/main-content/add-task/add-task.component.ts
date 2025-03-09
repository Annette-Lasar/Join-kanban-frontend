import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgModel, NgForm } from '@angular/forms';
import { AddTaskContentComponent } from '../../shared/components/add-task-content/add-task-content.component';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { TaskService } from '../../shared/services/task.service';
import { CategoryService } from '../../shared/services/category.service';
import { ContactService } from '../../shared/services/contact.service';
import { TaskCreationService } from '../../shared/services/task-creation.service';
import { ActionService } from '../../shared/services/action.service';
import { Task } from '../../shared/interfaces/task.interface';
import { Category } from '../../shared/interfaces/category.interface';
import { Contact } from '../../shared/interfaces/contact.interface';
import { Subscription } from 'rxjs';

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
    private taskService: TaskService,
    private categoryService: CategoryService,
    private contactService: ContactService,
    private taskCreationService: TaskCreationService,
    private cdr: ChangeDetectorRef,
    private actionService: ActionService
  ) {}

  ngOnInit(): void {
    // this.loadTasks();
    this.loadCategories();
    this.loadContacts();
    this.initializeResizeObserver();
    this.subscribeToSelectedCategory();
    this.subscribeToAssignedContacts();
    this.subscribeToResetNewTaskEvent();
  }

  /*   loadTasks(): void {
    const subscription = this.taskService.fetchData().subscribe({
      next: () => {
        this.taskService.tasks$.subscribe({
          next: (tasks) => {
            this.tasks = tasks;
            console.log('Tasks in AddTask:', this.tasks);
          },
          error: (err) =>
            console.error('Fehler beim Abrufen der Aufgaben:', err),
        });
      },
      error: (err) => console.error('Fehler beim Laden der Aufgaben:', err),
    });
    this.subscriptions.add(subscription);
  }
 */

  loadCategories(): void {
    const subscription = this.categoryService.fetchData().subscribe({
      next: () => {
        this.categoryService.categories$.subscribe({
          next: (categories) => {
            this.categories = categories;
            console.log('Kategorien in AddTask:', this.categories);
          },
          error: (err) =>
            console.error('Fehler beim Abrufen der Kategorien:', err),
        });
      },
      error: (err) => console.error('Fehler beim Laden der Kategorien:', err),
    });
    this.subscriptions.add(subscription);
  }

  loadContacts(): void {
    const subscription = this.contactService.fetchData().subscribe({
      next: () => {
        this.contactService.contacts$.subscribe({
          next: (contacts) => {
            this.contacts = contacts;
            console.log('Kontakte in AddTask:', this.contacts);
          },
          error: (err) =>
            console.error('Fehler beim Abrufen der Kontakte:', err),
        });
      },
      error: (err) => console.error('Fehler beim Laden der Kontakte:', err),
    });
    this.subscriptions.add(subscription);
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

    console.log('%cNeue Aufgabe wurde zurückgesetzt!', 'color: green;');
  }

  onSubmit(): void {
    const taskData = this.taskCreationService.getCurrentTask();

    if (!taskData.title?.trim()) {
      console.error('Fehler: Titel fehlt!');
      return;
    }

    console.log('%cNeue Aufgabe wird gesendet: ', 'color: green; ', taskData);
    this.taskCreationService.startTaskCreation('toDo', taskData);
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
    this.resizeObserver.disconnect();
  }
}
