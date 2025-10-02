import { Component } from '@angular/core';
import {MatCardModule} from '@angular/material/card';
import { ExpandList } from '../../../../common-components/expand-list/expand-list';
import { Button } from '../../../../common-components/button/button';
import { RouterLink } from '@angular/router';
import { TaskService } from '../../../../services/task.service';
import { AsyncPipe } from '@angular/common';
import { Observable } from 'rxjs';
import { Task } from '../../../../models/task.model';
import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
  CdkDrag,
  CdkDropList,
} from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-task-card',
  imports: [ MatCardModule, ExpandList, Button, RouterLink, AsyncPipe, CdkDropList, CdkDrag ],
  templateUrl: './task-card.html',
  styleUrl: './task-card.scss'
})
export class TaskCard {

  todo: any[] = [];
  inProgress: any[] = [];
  completed: any[] = [];

  constructor(private taskService: TaskService) {
    this.taskService.todo$.subscribe(todo => {
      this.todo = todo;
    });
    this.taskService.inProgress$.subscribe(progress => {
      this.inProgress = progress;
    });
    this.taskService.completed$.subscribe(completed => {
      this.completed = completed;
    });
  }

  drop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );
    }
  }
}
