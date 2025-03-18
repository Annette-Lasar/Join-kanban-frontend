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
  contact_ids?: number[] | undefined;
  category: Category;
  category_id?: number;
  subtasks: Subtask[];
  completed_subtasks?: number;
  board: number;
  created_by?: number | null;
  board_list?: BoardList;
  board_list_id?: number;
}

export interface Subtask {
  id?: number;
  title: string;
  checked_status: boolean;
}

export interface SubtaskUI extends Subtask {
  tempId?: number;
  isEditing?: boolean;
}
