import { Injectable } from '@angular/core';
import { TaskService } from './task.service';
import { Task } from '../interfaces/task.interface';
import { BehaviorSubject, Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { BoardListService } from './board-list.service';

@Injectable({
  providedIn: 'root',
})
export class TaskCreationService {
  private newTaskSubject = new BehaviorSubject<Partial<Task>>({});
  newTask$ = this.newTaskSubject.asObservable();

  constructor(
    private taskService: TaskService,
    private authService: AuthService,
    private boardListService: BoardListService
  ) {}

  startTaskCreation(boardListName: string, taskData: Partial<Task>): void {
    this.updateNewTask(taskData);
    const completeTaskData = this.getCurrentTask();
    const newTask = this.createNewTask(boardListName, completeTaskData) as Task;

    this.taskService.addData(newTask).subscribe({
      next: (createdTask) => console.log('Neue Aufgabe erstellt:', createdTask),
      error: (err) => console.error('Fehler beim Erstellen:', err),
    });
    this.clearNewTask();
    this.taskService.clearSelectedCategory();
    this.taskService.clearAssignedContacts();
  }

  updateNewTask(updatedData: Partial<Task>): void {
    const currentTask = this.newTaskSubject.getValue();
    const assignedContacts = this.taskService.getAssignedContacts();
    this.newTaskSubject.next({
      ...currentTask,
      ...updatedData,
      contacts: assignedContacts,
    });
  }

  clearNewTask(): void {
    this.newTaskSubject.next({
      title: '',
      description: '',
      due_date: '',
      priority: 'medium',
    });
  }

  getCurrentTask(): Partial<Task> {
    return this.newTaskSubject.getValue();
  }

  createNewTask(boardListName: string, taskData: Partial<Task>): Partial<Task> {
    const userId = this.authService.getUserId() ?? 4;
    const boardListId =
      this.boardListService.getBoardListIdByName(boardListName) ?? 1;

    console.log('%cKontakte als Objekte: ', 'color: blue;', taskData.contacts);
    console.log(
      '%cKontakt-IDs: ',
      'color: orchid;',
      taskData.contacts
        ?.map((c) => c.id)
        .filter((id): id is number => id !== undefined)
    );

    return {
      title: taskData.title ?? '',
      description: taskData.description ?? '',
      due_date: taskData.due_date ?? '',
      priority: taskData.priority ?? 'medium',
      category_id: taskData.category?.id ?? 1,
      contact_ids:
        taskData.contacts
          ?.map((c) => c.id)
          .filter((id): id is number => id !== undefined) ?? [],
      subtasks: [],
      completed_subtasks: 0,
      board_list: { id: boardListId, name: boardListName },
      board: 1,
      created_by: userId,
    };
  }
}
