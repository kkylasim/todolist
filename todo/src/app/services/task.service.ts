import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Task } from '../models/task.model';

@Injectable({ providedIn: 'root' })
export class TaskService {
  private tasksSource = new BehaviorSubject<any[]>([]);
  tasks$ = this.tasksSource.asObservable();

  private tasks: any[] = [];

  addTask(task: any) {
    const newTask: Task = {
      ...task,
      showCheckbox: true,      
      recurring: task.recurring ?? null, 
    };

    this.tasks.push(newTask);
    this.tasksSource.next(this.tasks);
    console.log('Task added:', newTask);
  }
}