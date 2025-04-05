export interface Category {
    id?: number;
    name: string;
    color: string;
    color_brightness?: boolean;
    is_deletable?: boolean;
    created_by?: number | null; 
  }