import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { BoardService } from './board.service';
import { TaskService } from './task.service';
import { CategoryService } from './category.service';
import { ContactService } from './contact.service';
import { Board } from '../interfaces/board.interface';
import { Task
 } from '../interfaces/task.interface';
 import { Category } from '../interfaces/category.interface';
 import { Contact } from '../interfaces/contact.interface';

@Injectable({
  providedIn: 'root',
})
export class DataLoaderService {
  constructor(
    private boardService: BoardService,
    private taskService: TaskService,
    private categoryService: CategoryService,
    private contactService: ContactService
  ) {}

  /** Lädt Boards und gibt sie als Observable zurück */
  loadBoards(): Observable<Board[]> {
    return this.boardService.fetchData().pipe(
      tap(() => console.log('Boards geladen'))
    );
  }

  /** Lädt Tasks und gibt sie als Observable zurück */
  loadTasks(): Observable<Task[]> {
    return this.taskService.fetchData().pipe(
      tap(() => console.log('Tasks geladen'))
    );
  }

  /** Lädt Kategorien */
  loadCategories(): Observable<Category[]> {
    return this.categoryService.fetchData().pipe(
      tap(() => console.log('Kategorien geladen'))
    );
  }

  /** Lädt Kontakte */
  loadContacts(): Observable<Contact[]> {
    return this.contactService.fetchData().pipe(
      tap(() => console.log('Kontakte geladen'))
    );
  }
}
