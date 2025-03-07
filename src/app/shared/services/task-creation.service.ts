import { Injectable } from '@angular/core';
import { TaskService } from './task.service';
import { Task } from '../interfaces/task.interface';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TaskCreationService {
  private newTaskSubject = new BehaviorSubject<Partial<Task>>({});
  newTask$ = this.newTaskSubject.asObservable();

  constructor(private taskService: TaskService) {}

  startTaskCreation(boardListName: string, taskData: Partial<Task>): void {
    this.updateNewTask(taskData);
    const completeTaskData = this.getCurrentTask();

    console.log('%cHier kommen die neuen Infos: ', 'color: green;', completeTaskData);
    
    const newTask = this.taskService.createNewTask(boardListName, completeTaskData);

    console.log('%cNeue Aufgabe erstellt: ', 'color: red;', newTask);

    /*     this.taskService.addData(newTask).subscribe({
      next: (createdTask) => console.log('Neue Aufgabe erstellt:', createdTask),
      error: (err) => console.error('Fehler beim Erstellen:', err),
    }); */
  }

  updateNewTask(updatedData: Partial<Task>): void {
    const currentTask = this.newTaskSubject.getValue();
    this.newTaskSubject.next({ ...currentTask, ...updatedData });
  }

  getCurrentTask(): Partial<Task> {
    return this.newTaskSubject.getValue();
  }
}
