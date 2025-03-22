import { Component, Input, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Task } from '../../../../shared/interfaces/task.interface';
import { SubtasksComponent } from '../../../../shared/components/subtasks/subtasks.component';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm, NgModel } from '@angular/forms';
import { ButtonComponent } from '../../../../shared/components/button/button.component';
import { CategoriesDropdownComponent } from '../../../../shared/components/dropdown-lists/categories-dropdown/categories-dropdown.component';
import { ContactsDropdownComponent } from '../../../../shared/components/dropdown-lists/contacts-dropdown/contacts-dropdown.component';
import { Contact } from '../../../../shared/interfaces/contact.interface';
import { Category } from '../../../../shared/interfaces/category.interface';
import { ActionService } from '../../../../shared/services/action.service';
import { TaskService } from '../../../../shared/services/task.service';
import { ButtonPropertyService } from '../../../../shared/services/button-propertys.service';
import { InfoBoxService } from '../../../../shared/services/info-box.service';
import { Subscription, Observable, tap } from 'rxjs';

@Component({
  selector: 'join-task-edit',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
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
  @ViewChild(CategoriesDropdownComponent)
  categoriesDropdownComponent!: CategoriesDropdownComponent;
  editedTask: Partial<Task> = {};
  selectedCategory: Category | null = null;
  isFormValid: boolean = true;
  pathPrefix: string = 'assets/icons/prio_';
  prioStatus: string = 'medium';
  today: string = new Date().toISOString().split('T')[0];
  private subscriptions = new Subscription();

  constructor(
    private actionService: ActionService,
    private taskService: TaskService,
    private buttonPropertyService: ButtonPropertyService,
    private infoBoxService: InfoBoxService
  ) {}

  ngOnInit(): void {
    if (this.task) {
      this.taskService.setCurrentTask(this.task);
    }
    this.initializeEditedTask();
    this.initializeSelectedCategory();
    this.subscribeToSelectedCategory();
    this.subscribeToEditedTaskEvent();
  }

  initializeEditedTask(): void {
    if (!this.task) return;

    this.editedTask = {
      id: this.task.id,
      title: this.task.title,
      description: this.task.description,
      due_date: this.task.due_date,
      priority: this.task.priority,
    };
    this.prioStatus = this.task.priority;
  }

  initializeSelectedCategory(): void {
    if (this.task?.category) {
      this.selectedCategory = this.task.category;
    } else {
      console.warn('Category is missing! Using default category.');
    }

    this.taskService.setSelectedCategory(this.selectedCategory);
  }

  setPrioStatus(status: string) {
    this.prioStatus = status;
  }

  validateForm(): void {
    this.isFormValid =
      !!this.editedTask.title?.trim() &&
      !!this.editedTask.due_date &&
      !!this.selectedCategory;
  }

  onFieldChange(): void {
    this.validateForm();
  }

  subscribeToSelectedCategory() {
    const subscription = this.taskService.selectedCategorySubject$.subscribe(
      (category) => {
        console.log('Kategorie: ', category);
        this.selectedCategory = category;
      }
    );
    this.subscriptions.add(subscription);
  }

  subscribeToEditedTaskEvent(): void {
    const subscription = this.actionService.saveEditedTaskEvent.subscribe(
      (id) => {
        if (this.categoriesDropdownComponent) {
          this.categoriesDropdownComponent.deleteMarkedCategories();
        }
        this.buttonPropertyService.setTaskEditMode(false);
      }
    );
    this.subscriptions.add(subscription);
  }

  onSubmit(): void {
    if (!this.editedTask.id) {
      console.error('Fehler: Keine gültige ID vorhanden.');
      return;
    }
    if (
      !this.editedTask.title?.trim() ||
      !this.editedTask.due_date ||
      !this.selectedCategory
    ) {
      console.error('Fehler: Pflichtfelder nicht ausgefüllt!');
      return;
    }

    this.actionService.saveEditedTaskEvent.emit(this.editedTask.id);

    this.saveEditedTask().subscribe({
      next: () => {
        this.taskService.clearSelectedCategory();
        this.taskService.clearAssignedContacts();
        this.actionService.handleInfoContainers({
          infoText: 'Task successfully edited.',
          isVisible: true,
          persistent: false,
        });
      },
      error: (err) => console.error('Fehler beim Speichern:', err),
    });
  }

  saveEditedTask(): Observable<Task> {
    const updatedTask = {
      ...this.taskService.generateTask(),
      title: this.editedTask.title,
      description: this.editedTask.description,
      due_date: this.editedTask.due_date,
      priority: this.prioStatus,
    };

    this.taskService.updateGeneralTaskState(updatedTask);

    return this.taskService
      .patchData(updatedTask.id!, updatedTask)
      .pipe(tap(() => console.log('Aufgabe erfolgreich aktualisiert!')));
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
