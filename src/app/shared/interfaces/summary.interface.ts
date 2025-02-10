export interface SummaryData {
  todo_count: number;
  done_count: number;
  in_progress_count: number;
  await_feedback_count: number;
  urgent_count: number;
  total_tasks: number;
  next_due_date: string | null;
}
