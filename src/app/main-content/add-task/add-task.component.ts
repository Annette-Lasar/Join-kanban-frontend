import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddTaskContentComponent } from '../../shared/components/add-task-content/add-task-content.component';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { TaskService } from '../../shared/services/task.service';
import { CategoryService } from '../../shared/services/category.service';
import { ContactService } from '../../shared/services/contact.service';
import { Task } from '../../shared/interfaces/task.interface';
import { Category } from '../../shared/interfaces/category.interface';
import { Contact } from '../../shared/interfaces/contact.interface';

@Component({
  selector: 'join-add-task',
  standalone: true,
  imports: [CommonModule, AddTaskContentComponent, ButtonComponent],
  templateUrl: './add-task.component.html',
  styleUrl: './add-task.component.scss',
})
export class AddTaskComponent implements OnInit {
  tasks: Task[] = [];
  categories: Category[] = [];
  contacts: Contact[] = [];

  constructor(
    private taskService: TaskService,
    private categoryService: CategoryService,
    private contactService: ContactService
  ) {}

  ngOnInit(): void {
    this.loadTasks();
    this.loadCategories();
    this.loadContacts();
  }

  loadTasks(): void {
    this.taskService.fetchData().subscribe({
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
  }

  loadCategories(): void {
    this.categoryService.fetchData().subscribe({
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
  }

  loadContacts(): void {
    this.contactService.fetchData().subscribe({
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
  }
}
