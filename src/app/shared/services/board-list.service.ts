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
    this.dataService
      .fetchData<BoardList>('board-lists', this.boardListsSubject)
      .subscribe({
        error: (err) => console.error('Fehler beim Laden der BoardLists:', err),
      });
  }

  getBoardListIdByName(name: string): number | undefined {
    const boardLists = this.boardListsSubject.getValue();
    const boardList = boardLists.find((list) => list.name === name);

    return boardList?.id;
  }
}
