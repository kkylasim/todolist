import { Component } from '@angular/core';
import {MatCardModule} from '@angular/material/card';
import { ExpandList } from '../../../../common-components/expand-list/expand-list';
import { Button } from '../../../../common-components/button/button';
import { RouterLink } from '@angular/router';
import { TaskService } from '../../../../services/task.service';
import { AsyncPipe } from '@angular/common';
import {
  CdkDragDrop,
  CdkDropListGroup,
  moveItemInArray,
  transferArrayItem,
  CdkDrag,
  CdkDropList,
} from '@angular/cdk/drag-drop';
import { NgIf } from '@angular/common';
import { CardList } from '../../../../common-components/card-list/card-list';

@Component({
  selector: 'app-task-card',
  imports: [ CardList, MatCardModule, CdkDropListGroup, ExpandList, Button, RouterLink, AsyncPipe, CdkDropList, CdkDrag, NgIf ],
  templateUrl: './task-card.html',
  styleUrl: './task-card.scss'
})
export class TaskCard {

  todo: any[] = [];
  inProgress: any[] = [];
  completed: any[] = [];

  constructor(private taskService: TaskService) {
    this.taskService.todaysTodo$.subscribe(todo => {
      this.todo = todo;
    });
    this.taskService.todaysInProgress$.subscribe(progress => {
      this.inProgress = progress;
    });
    this.taskService.todaysCompleted$.subscribe(completed => {
      this.completed = completed;
    });
  }

  drop(event: CdkDragDrop<any[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      const movedTask = event.previousContainer.data[event.previousIndex];
      // console.log('Drag drop:', {
      //   id: movedTask.id,
      //   prevStatus: movedTask.status,
      //   prevDueDate: movedTask.duedate,
      //   targetList: event.container.id
      // });
      if (event.container.id === 'todoList') {
        movedTask.status = 'Todo';
      } else if (event.container.id === 'inProgressList') {
        movedTask.status = 'Progress';
      } else if (event.container.id === 'doneList') {
        movedTask.status = 'Complete';
      }
      // console.log('Updating task:', movedTask);
      this.taskService.updateTask(movedTask.id, movedTask);
    }
  }
}
