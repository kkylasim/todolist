export interface Task {
    title: string;
    description: string;
    duedate: string;
    duetime: string;
    recurring?: Recurring | null;
    showCheckbox: boolean;
    tags: string[]
  }

export interface Recurring {
  frequency: number;
  type: string;
}