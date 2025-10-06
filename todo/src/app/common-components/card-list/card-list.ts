import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import {MatChipsModule} from '@angular/material/chips';
import {MatIconModule} from '@angular/material/icon';
import {CdkDrag, CdkDragHandle} from '@angular/cdk/drag-drop';
import { Router } from '@angular/router';
import { TaskService } from '../../services/task.service';

@Component({
  selector: 'app-card-list',
  imports: [MatButtonModule, MatCardModule, MatChipsModule, MatIconModule, CdkDrag, CdkDragHandle],
  templateUrl: './card-list.html',
  styleUrl: './card-list.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CardList {
  @Input() tasks: any[] = [];

  constructor(private router: Router, private taskService: TaskService) {}

  editTask(task: any) {
    this.router.navigate(['/editTaskView', task.id]);
  }

  deleteTask(task: any) {
    this.taskService.deleteTask(task.id);
  }
}
