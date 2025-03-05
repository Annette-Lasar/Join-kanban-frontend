import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Board } from '../interfaces/board.interface';
import { DataService } from './data.service';

@Injectable({
  providedIn: 'root',
})
export class BoardService {
  private boardsSubject = new BehaviorSubject<Board[]>([]);
  boards$ = this.boardsSubject.asObservable();

  constructor(private dataService: DataService) {}

  fetchData(): Observable<Board[]> {
    return this.dataService.fetchData<Board>('boards', this.boardsSubject);
  }

  addData(board: Board): Observable<Board> {
    return this.dataService.addData<Board>('boards', board, this.boardsSubject);
  }

  updateData(boardId: number, updatedBoard: Board): Observable<Board> {
    return this.dataService.updateData<Board>(
      'boards',
      boardId,
      updatedBoard,
      this.boardsSubject
    );
  }

  patchData(boardId: number, partialUpdate: Partial<Board>): Observable<Board> {
    return this.dataService.patchData<Board>(
      'boards',
      boardId,
      partialUpdate,
      this.boardsSubject
    );
  }

  deleteData(boardId: number): Observable<void> {
    return this.dataService.deleteData<Board>(
      'boards',
      boardId,
      this.boardsSubject
    );
  }
}
