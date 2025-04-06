import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, firstValueFrom } from 'rxjs';
import { Task, Subtask } from '../interfaces/task.interface';
import { Category } from '../interfaces/category.interface';
import { Contact } from '../interfaces/contact.interface';
import { DataService } from './data.service';
import { LocalStorageService } from './local-storage.service';
import { InfoBoxService } from './info-box.service';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private tasksSubject = new BehaviorSubject<Task[]>([]);
  tasks$: Observable<Task[]> = this.tasksSubject.asObservable();

  private subtasksSubject = new BehaviorSubject<Subtask[]>([]);
  subtasks$: Observable<Subtask[]> = this.subtasksSubject.asObservable();

  private currentTaskSubject = new BehaviorSubject<Task | null>(null);
  currentTask$: Observable<Task | null> =
    this.currentTaskSubject.asObservable();

  private selectedCategorySubject = new BehaviorSubject<Category | null>(null);
  selectedCategorySubject$: Observable<Category | null> =
    this.selectedCategorySubject.asObservable();

  private categoryTouchedSubject = new BehaviorSubject<boolean>(false);
  categoryTouched$: Observable<boolean> =
    this.categoryTouchedSubject.asObservable();

  private assignedContactsSubject = new BehaviorSubject<Contact[]>([]);
  assignedContactsSubject$: Observable<Contact[]> =
    this.assignedContactsSubject.asObservable();

  private newSubtasksSubject = new BehaviorSubject<Subtask[]>([]);
  newSubtasksSubject$: Observable<Subtask[]> =
    this.newSubtasksSubject.asObservable();

  private assignedSubtasksSubject = new BehaviorSubject<Subtask[]>([]);
  assignedSubtasksSubject$: Observable<Subtask[]> =
    this.assignedSubtasksSubject.asObservable();

  private titleIsValidSubject = new BehaviorSubject<boolean>(false);
  titleIsValid$ = this.titleIsValidSubject.asObservable();

  private dueDateIsValidSubject = new BehaviorSubject<boolean>(false);
  dueDateIsValid$ = this.dueDateIsValidSubject.asObservable();

  constructor(
    private dataService: DataService,
    private localStorageService: LocalStorageService,
    private infoBoxService: InfoBoxService
  ) {}

  /* =====================================================================
  Communication with dataService to send data to backend
  ========================================================================= */

  fetchData(): Observable<Task[]> {
    return this.dataService.fetchData<Task>('tasks', this.tasksSubject);
  }

  addData(task: Task): Observable<Task> {
    return this.dataService.addData<Task>('tasks', task, this.tasksSubject);
  }

  updateData(taskId: number, updatedTask: Task): Observable<Task> {
    return this.dataService.updateData<Task>(
      'tasks',
      taskId,
      updatedTask,
      this.tasksSubject
    );
  }

  patchData(taskId: number, partialUpdate: Partial<Task>): Observable<Task> {
    return this.dataService.patchData<Task>(
      'tasks',
      taskId,
      partialUpdate,
      this.tasksSubject
    );
  }

  patchSubtask(
    subtaskId: number,
    partialUpdate: Partial<Subtask>
  ): Observable<Subtask> {
    return this.dataService.patchData<Subtask>(
      'subtasks',
      subtaskId,
      partialUpdate,
      this.subtasksSubject
    );
  }

  deleteData(taskId: number): Observable<void> {
    return this.dataService.deleteData<Task>(
      'tasks',
      taskId,
      this.tasksSubject
    );
  }

  updateSubtaskStatus(taskId: number, subtask: Subtask): void {
    this.patchSubtask(subtask.id!, {
      checked_status: subtask.checked_status,
    }).subscribe({
      next: () => this.updateTaskState(taskId, subtask),
      error: (err) => this.handleUpdateError(subtask.id!, err),
    });
  }

  /* =====================================================================
  Getter methods for BehaviorSubjects
  ========================================================================= */
  getTasks(): Task[] {
    return this.tasksSubject.getValue();
  }

  getSelectedCategory(): Category | null {
    return this.selectedCategorySubject.getValue();
  }

  getAssignedContacts(): Contact[] {
    return this.assignedContactsSubject.getValue();
  }

  getSubtasks(): Subtask[] {
    return this.subtasksSubject.getValue();
  }

  getNewSubtasks(): Subtask[] {
    return this.newSubtasksSubject.getValue();
  }

  getAssignedSubtasks(): Subtask[] {
    return this.assignedSubtasksSubject.getValue();
  }

  getCurrentTask(): Task | null {
    return this.currentTaskSubject.getValue();
  }

  /* =====================================================================
  Setter methods for BehaviorSubjects
  ========================================================================= */

  setSelectedCategory(category: Category | null): void {
    this.selectedCategorySubject.next(category);
  }

  setCategoryTouched(touched: boolean): void {
    this.categoryTouchedSubject.next(touched);
  }

  setAssignedContacts(contacts: Contact[]): void {
    this.assignedContactsSubject.next(contacts);
  }

  setSubtasks(subtasks: Subtask[]): void {
    this.subtasksSubject.next(subtasks);
  }

  setNewSubtasks(subtasks: Subtask[]): void {
    this.newSubtasksSubject.next(subtasks);
  }

  setCurrentTask(task: Task): void {
    this.currentTaskSubject.next(task);
  }

  setAssignedSubtasks(subtasks: Subtask[]): void {
    this.assignedSubtasksSubject.next(subtasks);
  }

  setTitleIsValid(status: boolean): void {
    this.titleIsValidSubject.next(status);
  }

  setDueDateIsValid(status: boolean): void {
    this.dueDateIsValidSubject.next(status);
  }

  /* =====================================================================
  Methods to interact with frontend for new or changed task data
  ========================================================================= */
  updateGeneralTaskState(updatedTask: Partial<Task>): void {
    const tasks = this.tasksSubject.getValue();
    let hasChanges = false;

    const updatedTasks = tasks.map((task) => {
      if (task.id !== updatedTask.id) return task;

      const isEqual =
        task.board_list_id === updatedTask.board_list_id &&
        task.title === updatedTask.title &&
        task.description === updatedTask.description &&
        task.priority === updatedTask.priority &&
        task.due_date === updatedTask.due_date;

      if (isEqual) {
        return task;
      } else {
        hasChanges = true;
        return { ...task, ...updatedTask };
      }
    });

    if (hasChanges) {
      this.tasksSubject.next(updatedTasks);
    }
  }

  private updateTaskState(taskId: number, subtask: Subtask): void {
    const tasks = this.getTasks();
    const task = tasks.find((t) => t.id === taskId);

    if (!task) return;

    this.updateSubtaskCheckedStatus(task, subtask);
    task.completed_subtasks = task.subtasks.filter(
      (st) => st.checked_status
    ).length;
    this.tasksSubject.next([...tasks]);
  }

  private updateSubtaskCheckedStatus(task: Task, subtask: Subtask): void {
    const subtaskToUpdate = task.subtasks.find((st) => st.id === subtask.id);
    if (subtaskToUpdate) {
      subtaskToUpdate.checked_status = subtask.checked_status;
    }
  }

  updateCategoryInTasks(updatedCategory: Category): void {
    const tasks = this.tasksSubject.getValue();
    const updatedTasks = tasks.map((task) =>
      task.category.id === updatedCategory.id
        ? {
            ...task,
            category: {
              ...task.category,
              name: updatedCategory.name,
              color: updatedCategory.color,
              color_brightness: updatedCategory.color_brightness,
            },
          }
        : task
    );

    this.tasksSubject.next(updatedTasks);
  }

  getTasksByBoardList(tasks: Task[]): { [key: string]: Task[] } {
    return tasks.reduce((acc, task) => {
      if (!task.board_list || !task.board_list.name) {
        return acc;
      }
      const listName = task.board_list.name;
      acc[listName] = acc[listName] || [];
      acc[listName].push(task);
      return acc;
    }, {} as { [key: string]: Task[] });
  }

  async setContactsFromTask(taskId: number): Promise<void> {
    const tasks = await firstValueFrom(this.tasks$);
    const task = tasks.find((t) => t.id === taskId);
    this.setAssignedContacts(task?.contacts ?? []);
  }

  clearAssignedContacts(): void {
    this.setAssignedContacts([]);
  }

  clearSelectedCategory(): void {
    this.setSelectedCategory(null);
  }

  private handleUpdateError(subtaskId: number, error: any): void {
    console.error(`Fehler beim Aktualisieren von Subtask ${subtaskId}:`, error);
  }

  restoreOriginalTask(task: Task): void {
    const tasks = this.tasksSubject.getValue();
    const updatedTasks = tasks.map((t) => (t.id === task.id ? { ...task } : t));

    this.tasksSubject.next(updatedTasks);
  }

  removeTaskFromUI(taskId: number): void {
    const updatedTasks = this.tasksSubject
      .getValue()
      .filter((task) => task.id !== taskId);
    this.tasksSubject.next(updatedTasks);
  }

  deleteTaskFromBackend(taskId: number): void {
    this.deleteData(taskId).subscribe({
      next: () => this.showSuccessMessage('Task successfully deleted!'),
      error: (err) => console.error('Issue deleting task: ', err),
    });
  }

  generateTask(): Task {
    const currentTask = this.getCurrentTask();
    const selectedCategory = this.getSelectedCategory();
    const assignedContacts = this.getAssignedContacts();
    const subtasks = this.getSubtasks();
    const userId = this.localStorageService.getUserIdFromLocalStorage() ?? 4;
    if (!currentTask) throw new Error('Keine Aufgabe vorhanden!');

    return {
      ...currentTask,
      id: currentTask?.id ?? undefined,
      title: currentTask?.title ?? '',
      description: currentTask?.description ?? '',
      due_date: currentTask?.due_date ?? '',
      priority: currentTask?.priority ?? 'medium',
      category: selectedCategory ?? {
        id: 1,
        name: 'Technical Task',
        color: '#1FD7C1',
        color_brightness: true,
        created_by: null,
      },
      category_id: selectedCategory?.id,
      contacts: assignedContacts ?? [],
      contact_ids:
        assignedContacts
          ?.filter((c) => c.id !== undefined)
          .map((c) => c.id as number) ?? [],
      subtasks: subtasks ?? [],
      completed_subtasks: subtasks?.filter((s) => s.checked_status).length ?? 0,
      board_list: currentTask?.board_list ?? { id: 1, name: 'toDo' },
      board: currentTask?.board ?? 1,
      created_by: userId,
    };
  }

  showSuccessMessage(message: string) {
    setTimeout(() => {
      this.infoBoxService.setInfoBox({
        isVisible: true,
        infoText: message,
        infoMessageClass: 'success-message',
        persistent: false,
      });
    }, 1000);
  }
}
