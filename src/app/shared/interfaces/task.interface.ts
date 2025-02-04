export interface Task {
    id?: number;  
    title: string;
    description: string;
    priority: string;
    due_date: string; // Falls du Date-Objekte nutzt, besser Date statt string
    contacts: number[]; // IDs der zugewiesenen Kontakte
    category_id: number;
    subtasks: Subtask[]; 
    status: string;
    board: number;
    created_by?: number;
  }
  

  export interface Subtask {
    id?: number;
    title: string;
    checked_status: boolean;
  }