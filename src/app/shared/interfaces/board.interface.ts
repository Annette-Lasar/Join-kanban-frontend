import { BoardList } from './board-list.interface';

export interface Board {
  board_id: number;
  board_name: string;
  board_lists: BoardList[];  // Jetzt ein Array von BoardList-Objekten
}

