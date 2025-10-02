import { Injectable } from '@angular/core';
import { BehaviorSubject, combineLatest, map } from 'rxjs';
import { Task } from '../models/task.model';

@Injectable({ providedIn: 'root' })
export class TaskService {
  // Use a single source of truth for tasks
  private initialTasks: any[] = [
    {
      id: 1,
      status: 'Todo',
      title: 'Write Angular Tutorial',
      description: 'Create a tutorial for Angular beginners',
      duedate: '2025-10-05',
      duetime: '10:00',
      recurring: null,
      tags: ['Angular', 'Writing']
    },
    {
      id: 2,
      status: 'Progress',
      title: 'Team Meeting',
      description: 'Discuss project milestones and blockers',
      duedate: '2025-10-02',
      duetime: '14:00',
      recurring: { frequency: 1, type: 'Weekly' },
      tags: ['Meeting', 'Team']
    },
    {
      id: 3,
      status: 'Complete',
      title: 'Code Review',
      description: 'Review pull requests for the latest sprint',
      duedate: '2025-09-30',
      duetime: '16:30',
      recurring: null,
      tags: ['Code', 'Review']
    },
    {
      id: 4,
      status: 'Todo',
      title: 'Write Blog Post',
      description: 'Post about new Angular features',
      duedate: '2025-10-07',
      duetime: '11:00',
      recurring: { frequency: 2, type: 'Monthly' },
      tags: ['Blog', 'Angular']
    },
    {
      id: 5,
      status: 'Progress',
      title: 'Design Mockups',
      description: 'Create UI mockups for new feature',
      duedate: '2025-10-03',
      duetime: '09:00',
      recurring: null,
      tags: ['Design', 'UI']
    },
    {
      id: 6,
      status: 'Todo',
      title: 'Prepare Presentation',
      description: 'Prepare slides for client meeting',
      duedate: '2025-10-04',
      duetime: '13:00',
      recurring: null,
      tags: ['Presentation', 'Client']
    },
    {
      id: 7,
      status: 'Complete',
      title: 'Deploy Update',
      description: 'Deploy the latest release to production',
      duedate: '2025-09-29',
      duetime: '17:00',
      recurring: { frequency: 1, type: 'Weekly' },
      tags: ['Deployment', 'Release']
    }
  ];

  private tasks: any[] = [...this.initialTasks]; // main array for all operations
  public tasksSource = new BehaviorSubject<any[]>([...this.initialTasks]);
  tasks$ = this.tasksSource.asObservable();

  todo$ = this.tasks$.pipe(
    map(tasks => tasks.filter(t => t.status === 'Todo'))
  );

  inProgress$ = this.tasks$.pipe(
    map(tasks => tasks.filter(t => t.status === 'Progress'))
  );

  completed$ = this.tasks$.pipe(
    map(tasks => tasks.filter(t => t.status === 'Complete'))
  );

  //search function
  private searchTermSubject = new BehaviorSubject<string>('');
  searchTerm$ = this.searchTermSubject.asObservable();

  filteredtasks$ = combineLatest([this.tasks$, this.searchTerm$]).pipe(
    map(([tasks, searchTerm]) => {
      const term = searchTerm.toLowerCase();
      return tasks.filter( t => t.title.toLowerCase().includes(term));
    })
  )

  setSearchTerm(term: string) {
    console.log(this.completed$)
    console.log(term);
    this.searchTermSubject.next(term);
  }

  //create function
  addTask(task: Partial<Task>) {
    const newTask: Partial<Task> = {
      ...task,
      recurring: task.recurring ?? null, 
    };
    this.tasks.push(newTask); // add to main array
    this.tasksSource.next([...this.tasks]); // update observable
    console.log('Task added:', newTask);
  }

  getTaskById(id: number): Partial<Task> | undefined {
    return this.tasks[id];
  }

  //update task
  updateTask(id: number, updatedTask: Partial<Task>) {
    const idx = this.tasks.findIndex(t => t.id === id);
    if (idx !== -1) {
      this.tasks[idx] = { ...updatedTask };
      this.tasksSource.next([...this.tasks]);
    }
  }

  //delete function
  deleteTask(id: number) {
    this.tasks = this.tasks.filter( t => t.id !== id );
    this.tasksSource.next([...this.tasks]);
  }
}