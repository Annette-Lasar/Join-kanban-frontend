import { Injectable } from '@angular/core';
import { TaskService } from './task.service';
import { Task } from '../interfaces/task.interface';
import { BehaviorSubject, Observable } from 'rxjs';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { LocalStorageService } from './local-storage.service';
import { BoardListService } from './board-list.service';
import { BoardStatusService } from './board-status.service';
import { ActionService } from './action.service';

@Injectable({
  providedIn: 'root',
})
export class TaskCreationService {
  private newTaskSubject = new BehaviorSubject<Partial<Task>>({});
  newTask$: Observable<Partial<Task>> = this.newTaskSubject.asObservable();

  constructor(
    private taskService: TaskService,
    private boardListService: BoardListService,
    private boardStatusService: BoardStatusService,
    private localStorageService: LocalStorageService,
    private actionService: ActionService,
    private router: Router,
    private location: Location
  ) {}

  startTaskCreation(boardListName: string, taskData: Partial<Task>): void {
    this.updateNewTask(taskData);
    const completeTaskData = this.getCurrentTask();
    const newTask = this.createNewTask(boardListName, completeTaskData) as Task;

    this.taskService.addData(newTask).subscribe({
      next: (createdTask) => {
        console.log('New task successfully created:', createdTask);
        this.clearNewTask();
        this.taskService.clearSelectedCategory();
        this.taskService.clearAssignedContacts();
        this.boardStatusService.setBoardTaskOverlayOpenStatus(false);
        this.showSuccessMessage();
        this.directToBoard();
      },
      error: (err) => console.error('Error creating task:', err),
    });
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
    const currentTask = this.newTaskSubject.getValue();
    console.log('Current Task im getCurrentTask: ', currentTask);

    return {
      ...currentTask,
      category: this.taskService.getSelectedCategory() ?? undefined,
    };
  }

  createNewTask(boardListName: string, taskData: Partial<Task>): Partial<Task> {
    const userId = this.localStorageService.getUserIdFromLocalStorage() ?? 4;
    const boardListId =
      this.boardListService.getBoardListIdByName(boardListName) ?? 1;

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
      board_list_id: boardListId,
      board: 1,
      created_by: userId,
    };
  }

  showSuccessMessage(): void {
    this.actionService.handleInfoContainers({
      infoText: 'Task successfully created!',
      isVisible: true,
      persistent: false,
    });
  }

  directToBoard(): void {
    const currentUrl = this.location.path();
    if (currentUrl.includes('/main-content/add-task')) {
      this.router.navigate(['/main-content/board']);
    }
  }
}
