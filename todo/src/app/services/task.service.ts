import { Injectable } from '@angular/core';
import { BehaviorSubject, combineLatest, map } from 'rxjs';
import { Task } from '../models/task.model';
import { StorageService } from './storage.service';
import { ProgressService } from '../services/progress.service';

const TASKS_KEY = 'tasks';
const COMPLETED_TASK_IDS_KEY = 'completedTaskIds';

@Injectable({ providedIn: 'root' })
export class TaskService {
  private tasks: Task[] = [];
  public tasksSource = new BehaviorSubject<Task[]>([]);
  tasks$ = this.tasksSource.asObservable();

  constructor(private storage: StorageService) {
    // Load tasks from localStorage or use dummy data if not present
    const storedTasks = this.storage.getItem<Task[]>(TASKS_KEY);
    if (storedTasks && storedTasks.length > 0) {
      this.tasks = storedTasks;
    } else {
      this.tasks = [ ];
      this.storage.setItem(TASKS_KEY, this.tasks);
    }
    this.tasksSource.next([...this.tasks]);
  }

  // Utility: get today's date in YYYY-MM-DD format (local timezone)
  private getToday(): string {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  // Utility: normalize date string to local YYYY-MM-DD
  private normalizeDate(date: string | Date): string {
    if (!date) return '';
    const d = typeof date === 'string' ? new Date(date) : date;
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  // Observable for today's tasks (compare using normalized local date)
  todo$ = this.tasks$.pipe(
    map(tasks => tasks.filter(t => t.status === 'Todo'))
  )
  inProgress$ = this.tasks$.pipe(
    map(tasks => tasks.filter(t => t.status === 'Progress'))
  )
  completed$ = this.tasks$.pipe(
    map(tasks => tasks.filter(t => t.status === 'Complete'))
  )

  //search function
  private searchTermSubject = new BehaviorSubject<string>('');
  searchTerm$ = this.searchTermSubject.asObservable();

  filteredtasks$ = combineLatest([this.tasks$, this.searchTerm$]).pipe(
    map(([tasks, searchTerm]) => {
      const term = searchTerm.toLowerCase();
      return tasks.filter(t => t.title.toLowerCase().includes(term));
    })
  );

  setSearchTerm(term: string) {
    this.searchTermSubject.next(term);
  }

  // Create
  addTask(task: Task) {
    console.log(task)
    this.tasks.push(task);
    this.storage.setItem(TASKS_KEY, this.tasks);
    this.tasksSource.next([...this.tasks]);
  }

  // Read
  getTaskById(id: number): Task | undefined {
    return this.tasks.find(t => t.id === id);
  }

  // Get the persistent set of completed task IDs
  private getCompletedTaskIds(): number[] {
    const ids = localStorage.getItem(COMPLETED_TASK_IDS_KEY);
    return ids ? JSON.parse(ids) : [];
  }

  // Add a completed task ID to persistent storage
  private addCompletedTaskId(id: number) {
    const ids = this.getCompletedTaskIds();
    if (!ids.includes(id)) {
      ids.push(id);
      localStorage.setItem(COMPLETED_TASK_IDS_KEY, JSON.stringify(ids));
    }
  }

  // Remove a completed task ID from persistent storage
  private removeCompletedTaskId(id: number) {
    const ids = this.getCompletedTaskIds();
    const idx = ids.indexOf(id);
    if (idx !== -1) {
      ids.splice(idx, 1);
      localStorage.setItem(COMPLETED_TASK_IDS_KEY, JSON.stringify(ids));
    }
  }

  // Public: get total number of unique completed tasks
  getTotalCompletedCount(): number {
    return this.getCompletedTaskIds().length;
  }

  // Update
  updateTask(id: number, updatedTask: Task, prevStatus?: string) {
    const idx = this.tasks.findIndex(t => t.id === id);
    if (idx !== -1) {
      this.tasks[idx] = { ...updatedTask };
      this.storage.setItem(TASKS_KEY, this.tasks);
      this.tasksSource.next([...this.tasks]);
      // Update progress after any task status change
      const completedCount = this.tasks.filter(t => t.status === 'Complete').length;

      // Progress milestone logic
      if (typeof window !== 'undefined' && (window as any).ng && (window as any).ng.getInjector) {
        try {
          const injector = (window as any).ng.getInjector(document.querySelector('app-root'));
          const progressService = injector.get(ProgressService);
          // If task is newly completed (was not complete before)
          if (updatedTask.status === 'Complete' && prevStatus !== 'Complete') {
            progressService.incrementCompletedThisLevel();
          }
          // If task is moved out of complete (was complete before, now not)
          if (prevStatus === 'Complete' && updatedTask.status !== 'Complete') {
            progressService.decrementCompletedThisLevel();
          }
          progressService.setTasksDone(completedCount);
        } catch (e) {}
      }

      console.log(prevStatus, updatedTask.status, typeof(prevStatus));
      if (updatedTask.status === 'Complete') {
        this.addCompletedTaskId(id);
      } else if ((prevStatus as string) === 'Complete' && (updatedTask.status as string) !== 'Complete') {
        this.removeCompletedTaskId(id);
      }

      console.log('Task updated:', updatedTask);
      
      if (typeof window !== 'undefined' && (window as any).ng && (window as any).ng.getInjector) {
        try {
          const injector = (window as any).ng.getInjector(document.querySelector('app-root'));
          const progressService = injector.get(ProgressService);
          progressService.setTasksDone(completedCount);
        } catch (e) {
        }
      }
    }
  }

  // Delete
  deleteTask(id: number) {
    this.tasks = this.tasks.filter(t => t.id !== id);
    this.storage.setItem(TASKS_KEY, this.tasks);
    this.tasksSource.next([...this.tasks]);
    // Update progress after deletion
    const completedCount = this.tasks.filter(t => t.status === 'Complete').length;
    if (typeof window !== 'undefined' && (window as any).ng && (window as any).ng.getInjector) {
      try {
        const injector = (window as any).ng.getInjector(document.querySelector('app-root'));
        const progressService = injector.get(ProgressService);
        progressService.setTasksDone(completedCount);
      } catch (e) {}
    }
  }

  /**
   * Remove all tasks with status 'Complete' but keep completed task IDs for total count
   */
  clearCompletedTasks() {
    this.tasks = this.tasks.filter(t => t.status !== 'Complete');
    this.storage.setItem(TASKS_KEY, this.tasks);
    this.tasksSource.next([...this.tasks]);
    // Do NOT clear completed task IDs here, so total completed count is preserved
  }
}