/* import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { DataService } from './data.service';
import { BoardList } from '../interfaces/board-list.interface';

@Injectable({
  providedIn: 'root',
})
export class BoardListService {
  private boardListsSubject = new BehaviorSubject<BoardList[]>([]);
  boardLists$: Observable<BoardList[]> = this.boardListsSubject.asObservable();

  constructor(private dataService: DataService) {}

  fetchBoardLists(): void {
    this.dataService.fetchData<BoardList>('board-lists', this.boardListsSubject);
  }

  getBoardListId(boardLists: BoardList[], name: string): number | undefined {
    return boardLists.find((list) => list.name === name)?.id;
  }
}
 */


import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { DataService } from './data.service';
import { BoardList } from '../interfaces/board-list.interface';

@Injectable({
  providedIn: 'root',
})
export class BoardListService {
  private boardListsSubject = new BehaviorSubject<BoardList[]>([]);
  boardLists$: Observable<BoardList[]> = this.boardListsSubject.asObservable();

  constructor(private dataService: DataService) {}

  fetchBoardLists(): void {
    this.dataService.fetchData<BoardList>('board-lists', this.boardListsSubject);
  }

  getBoardListIdByName(name: string): number | undefined {
    const boardLists = this.boardListsSubject.getValue(); // Holt die aktuellen Board-Listen aus dem BehaviorSubject
    return boardLists.find((list) => list.name === name)?.id;
  }
}
