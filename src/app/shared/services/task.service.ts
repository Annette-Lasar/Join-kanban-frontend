import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Task } from '../interfaces/task.interface';
import { DataService } from './data.service';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private tasksSubject = new BehaviorSubject<Task[]>([]);
  tasks$ = this.tasksSubject.asObservable();

  constructor(private dataService: DataService) {}

  fetchData(): Observable<Task[]> {
    return this.dataService.fetchData<Task>('tasks', this.tasksSubject);
  }

  addData(task: Task): Observable<Task> {
    return this.dataService.addData<Task>('tasks', task, this.tasksSubject);
  }

  updateData(taskId: number, updatedTask: Task): Observable<Task> {
    return this.dataService.updateData<Task>('tasks', taskId, updatedTask, this.tasksSubject);
  }

  patchData(taskId: number, partialUpdate: Partial<Task>): Observable<Task> {
    return this.dataService.patchData<Task>('tasks', taskId, partialUpdate, this.tasksSubject);
  }

  deleteDatak(taskId: number): Observable<void> {
    return this.dataService.deleteData<Task>('tasks', taskId, this.tasksSubject);
  }
}

