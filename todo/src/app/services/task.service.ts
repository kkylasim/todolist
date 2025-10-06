import { Injectable } from '@angular/core';
import { BehaviorSubject, combineLatest, map } from 'rxjs';
import { Task } from '../models/task.model';
import { StorageService } from './storage.service';
import { ProgressService } from '../services/progress.service';

const TASKS_KEY = 'tasks';

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
      this.tasks = [
        {
          id: 1,
          status: 'Todo',
          title: 'Write Angular Tutorial',
          description: 'Create a tutorial for Angular beginners',
          duedate: '2025-10-05',
          duetime: '10:00',
          recurring: null,
          tags: [1, 2]
        },
        {
          id: 2,
          status: 'Progress',
          title: 'Team Meeting',
          description: 'Discuss project milestones and blockers',
          duedate: '2025-10-02',
          duetime: '14:00',
          recurring: { frequency: 1, type: 'Weekly' },
          tags: [3, 4]
        },
        {
          id: 3,
          status: 'Complete',
          title: 'Code Review',
          description: 'Review pull requests for the latest sprint',
          duedate: '2025-09-30',
          duetime: '16:30',
          recurring: null,
          tags: [5, 6]
        },
        {
          id: 4,
          status: 'Todo',
          title: 'Write Blog Post',
          description: 'Post about new Angular features',
          duedate: '2025-10-06',
          duetime: '11:00',
          recurring: { frequency: 2, type: 'Monthly' },
          tags: [7, 1]
        },
        {
          id: 5,
          status: 'Progress',
          title: 'Design Mockups',
          description: 'Create UI mockups for new feature',
          duedate: '2025-10-06',
          duetime: '09:00',
          recurring: null,
          tags: [8, 9]
        },
        {
          id: 6,
          status: 'Todo',
          title: 'Prepare Presentation',
          description: 'Prepare slides for client meeting',
          duedate: '2025-10-06',
          duetime: '13:00',
          recurring: null,
          tags: [10, 11]
        },
        {
          id: 7,
          status: 'Complete',
          title: 'Deploy Update',
          description: 'Deploy the latest release to production',
          duedate: '2025-10-06',
          duetime: '17:00',
          recurring: { frequency: 1, type: 'Weekly' },
          tags: [12, 13]
        }
      ];
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
  todaysTasks$ = this.tasks$.pipe(
    map(tasks => {
      const todayStr = this.getToday();
      return tasks.filter(t => this.normalizeDate(t.duedate) === todayStr);
    })
  );

  todaysTodo$ = this.todaysTasks$.pipe(
    map(tasks => tasks.filter(t => t.status === 'Todo'))
  );

  todaysInProgress$ = this.todaysTasks$.pipe(
    map(tasks => tasks.filter(t => t.status === 'Progress'))
  );

  todaysCompleted$ = this.todaysTasks$.pipe(
    map(tasks => tasks.filter(t => t.status === 'Complete'))
  );

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

  // Update
  updateTask(id: number, updatedTask: Task) {
    const idx = this.tasks.findIndex(t => t.id === id);
    if (idx !== -1) {
      this.tasks[idx] = { ...updatedTask };
      this.storage.setItem(TASKS_KEY, this.tasks);
      this.tasksSource.next([...this.tasks]);
      // Update progress after any task status change
      const completedCount = this.tasks.filter(t => t.status === 'Complete' && t.duedate === this.getToday()).length;
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
  }
}