import { Contact } from './contact.interface';
import { Category } from './category.interface';

export interface Task {
  id?: number;
  title: string;
  description: string;
  priority: string;
  due_date: string;
  contacts: Contact[];
  category: Category;
  subtasks: Subtask[];
  completed_subtasks?: number;
  status: string;
  board: number;
  created_by?: number | null;
  board_list?: BoardList;
}

export interface Subtask {
  id?: number;
  title: string;
  checked_status: boolean;
}

export interface BoardList {
  id: number;
  name: string;
}
