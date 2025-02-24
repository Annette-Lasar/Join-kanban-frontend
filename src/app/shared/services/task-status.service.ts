import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Task } from '../interfaces/task.interface';

@Injectable({
  providedIn: 'root',
})
export class TaskStatusService {
  private originalTaskStateSubject = new BehaviorSubject<Task | null>(null);
  originalTaskStateSubject$: Observable<Task | null> =
    this.originalTaskStateSubject.asObservable();

  /* =============================================================
  
  METHODS

  ================================================================  */
  setOriginalTaskStatus(task: Task | null) {
    this.originalTaskStateSubject.next(
      task ? {...task, contacts: [...task.contacts], subtasks: [...task.subtasks]} : null
    );
    console.log('Wert von BehaviorSubject gespeichert: ', this.originalTaskStateSubject.getValue());
  }

  getOriginalTaskStatus(): Task | null {
    return this.originalTaskStateSubject.getValue();
  }
}
