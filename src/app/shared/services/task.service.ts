import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Task } from '../interfaces/task.interface';
import { BASE_URL } from '../data/global-variables.data';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private tasksSubject = new BehaviorSubject<Task[]>([]);
  tasks$ = this.tasksSubject.asObservable();

  // constructor(private http: HttpClient) {}
  constructor(private http: HttpClient) {
    console.log('TaskService wurde instanziiert!'); 
  }

  fetchTasks(): Observable<Task[]> {
    console.log(`GET Request to: ${BASE_URL}/tasks`);
    return this.http.get<Task[]>(`${BASE_URL}/tasks`).pipe(
      tap((tasks) => {
        // console.log("Fetched tasks:", tasks);
        console.log('Response from API:', tasks);
        this.tasksSubject.next(tasks);
      })
    );
  }

  addTask(task: Task): Observable<Task> {
    return this.http
      .post<Task>(`${BASE_URL}/tasks`, task)
      .pipe(
        tap((newTask) =>
          this.tasksSubject.next([...this.tasksSubject.value, newTask])
        )
      );
  }
}
