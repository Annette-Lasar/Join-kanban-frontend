export interface Category {
    id?: number;
    name: string;
    color: string;
    color_brightness?: boolean;
    deletable?: boolean;
    created_by?: number | null; 
  }