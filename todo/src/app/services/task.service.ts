import { Injectable } from '@angular/core';
import { BehaviorSubject, combineLatest, map } from 'rxjs';
import { Task } from '../models/task.model';

@Injectable({ providedIn: 'root' })
export class TaskService {
  // Centralized tag list (should be moved to TagService)
  public initialTags = [
    { id: 1, name: 'Angular', color: '#DD0031' },
    { id: 2, name: 'Writing', color: '#FFD700' },
    { id: 3, name: 'Meeting', color: '#2196F3' },
    { id: 4, name: 'Team', color: '#4CAF50' },
    { id: 5, name: 'Code', color: '#9C27B0' },
    { id: 6, name: 'Review', color: '#FF5722' },
    { id: 7, name: 'Blog', color: '#FF9800' },
    { id: 8, name: 'Design', color: '#E91E63' },
    { id: 9, name: 'UI', color: '#00BCD4' },
    { id: 10, name: 'Presentation', color: '#8BC34A' },
    { id: 11, name: 'Client', color: '#795548' },
    { id: 12, name: 'Deployment', color: '#607D8B' },
    { id: 13, name: 'Release', color: '#F44336' }
  ];

  private initialTasks: any[] = [
    {
      id: 1,
      status: 'Todo',
      title: 'Write Angular Tutorial',
      description: 'Create a tutorial for Angular beginners',
      duedate: '2025-10-05',
      duetime: '10:00',
      recurring: null,
      tags: [1, 2] // Angular, Writing
    },
    {
      id: 2,
      status: 'Progress',
      title: 'Team Meeting',
      description: 'Discuss project milestones and blockers',
      duedate: '2025-10-02',
      duetime: '14:00',
      recurring: { frequency: 1, type: 'Weekly' },
      tags: [3, 4] // Meeting, Team
    },
    {
      id: 3,
      status: 'Complete',
      title: 'Code Review',
      description: 'Review pull requests for the latest sprint',
      duedate: '2025-09-30',
      duetime: '16:30',
      recurring: null,
      tags: [5, 6] // Code, Review
    },
    {
      id: 4,
      status: 'Todo',
      title: 'Write Blog Post',
      description: 'Post about new Angular features',
      duedate: '2025-10-07',
      duetime: '11:00',
      recurring: { frequency: 2, type: 'Monthly' },
      tags: [7, 1] // Blog, Angular
    },
    {
      id: 5,
      status: 'Progress',
      title: 'Design Mockups',
      description: 'Create UI mockups for new feature',
      duedate: '2025-10-03',
      duetime: '09:00',
      recurring: null,
      tags: [8, 9] // Design, UI
    },
    {
      id: 6,
      status: 'Todo',
      title: 'Prepare Presentation',
      description: 'Prepare slides for client meeting',
      duedate: '2025-10-04',
      duetime: '13:00',
      recurring: null,
      tags: [10, 11] // Presentation, Client
    },
    {
      id: 7,
      status: 'Complete',
      title: 'Deploy Update',
      description: 'Deploy the latest release to production',
      duedate: '2025-09-29',
      duetime: '17:00',
      recurring: { frequency: 1, type: 'Weekly' },
      tags: [12, 13] // Deployment, Release
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
    this.tasks = this.tasks.filter(t => t.id !== id);
    this.tasksSource.next([...this.tasks]);
  }
}