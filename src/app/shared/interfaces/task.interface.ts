import { Contact } from './contact.interface';
import { Category } from './category.interface';
import { BoardList } from './board-list.interface';

export interface Task {
  id?: number;
  title: string;
  description: string;
  priority: string;
  due_date: string;
  contacts: Contact[];
  category: Category;
  category_id?: number;
  subtasks: Subtask[];
  completed_subtasks?: number;
  board: number;
  created_by?: number | null;
  board_list?: BoardList;
}

export interface Subtask {
  id?: number;
  title: string;
  checked_status: boolean;
}

export interface SubtaskUI extends Subtask {
  isEditing?: boolean;
}

/* export interface BoardList {
  id: number;
  name: string;
} */
