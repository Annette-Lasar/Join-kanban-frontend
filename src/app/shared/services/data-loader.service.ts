import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { BoardService } from './board.service';
import { TaskService } from './task.service';
import { CategoryService } from './category.service';
import { ContactService } from './contact.service';
import { Board } from '../interfaces/board.interface';
import { Task } from '../interfaces/task.interface';
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

  loadBoards(): Observable<Board[]> {
    return this.boardService.fetchData();
  }

  loadTasks(): Observable<Task[]> {
    return this.taskService.fetchData();
  }

  loadCategories(): Observable<Category[]> {
    return this.categoryService.fetchData();
  }

  loadContacts(): Observable<Contact[]> {
    return this.contactService.fetchData();
  }
}
