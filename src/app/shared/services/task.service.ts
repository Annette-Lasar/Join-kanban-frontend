import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Task } from '../interfaces/task.interface';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private tasksSubject = new BehaviorSubject<Task[]>([]);
  tasks$ = this.tasksSubject.asObservable();

  constructor(private http: HttpClient) {}

  fetchTasks(): Observable<Task[]> {
    return this.http.get<Task[]>('/api/tasks').pipe(
      tap(tasks => this.tasksSubject.next(tasks)) 
    );
  }

  addTask(task: Task): Observable<Task> {
    return this.http.post<Task>('/api/tasks', task).pipe(
      tap(newTask => this.tasksSubject.next([...this.tasksSubject.value, newTask]))
    );
  }
}
