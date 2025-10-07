export interface Task {
    id: number;
    status: 'Todo' | 'Progress' | 'Complete';
    title: string;
    description: string;
    duedate: string;
    duetime: string;
    recurring: Recurring | null;
    tags: number[];
    isOverdue?: boolean; // New property to flag overdue tasks
}

export interface Recurring {
  frequency: number;
  type: string;
}