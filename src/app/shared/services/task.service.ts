import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Task } from '../interfaces/task.interface';
import { Subtask } from '../interfaces/task.interface';
import { DataService } from './data.service';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private tasksSubject = new BehaviorSubject<Task[]>([]);
  tasks$: Observable<Task[]> = this.tasksSubject.asObservable();
  private subtasksSubject = new BehaviorSubject<Subtask[]>([]);
  subtasks$: Observable<Subtask[]> = this.subtasksSubject.asObservable();

  constructor(private dataService: DataService) {}

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

  deleteDatak(taskId: number): Observable<void> {
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

  private updateTaskState(taskId: number, subtask: Subtask): void {
    const tasks = this.tasksSubject.getValue();
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

  private handleUpdateError(subtaskId: number, error: any): void {
    console.error(`Fehler beim Aktualisieren von Subtask ${subtaskId}:`, error);
  }

  restoreOriginalTask(task: Task): void {
    const tasks = this.tasksSubject.getValue();
    const updatedTasks = tasks.map((t) => (t.id === task.id ? { ...task } : t));

    console.log('Board-Tasks nach Wiederherstellung: ', updatedTasks);

    this.tasksSubject.next(updatedTasks);
  }
}
