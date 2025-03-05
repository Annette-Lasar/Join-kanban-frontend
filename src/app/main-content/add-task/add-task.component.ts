import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgModel, NgForm } from '@angular/forms';
import { AddTaskContentComponent } from '../../shared/components/add-task-content/add-task-content.component';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { TaskService } from '../../shared/services/task.service';
import { CategoryService } from '../../shared/services/category.service';
import { ContactService } from '../../shared/services/contact.service';
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
  isFormValid: boolean = false;
  subscriptions = new Subscription();

  constructor(
    private taskService: TaskService,
    private categoryService: CategoryService,
    private contactService: ContactService
  ) {}

  ngOnInit(): void {
    // this.loadTasks();
    this.loadCategories();
    this.loadContacts();
    this.subscribeToSelectedCategory();
    this.subscribeToAssignedContacts();
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

  onSubmit(): void {
    // Code zum Triggern eines Klick-Events für das Erstellen einer neuen Aufgabe hier
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
