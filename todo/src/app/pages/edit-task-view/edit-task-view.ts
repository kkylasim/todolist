import { Component, ChangeDetectionStrategy, OnInit } from '@angular/core';
import {MatSelectModule} from '@angular/material/select';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {provideNativeDateAdapter} from '@angular/material/core';
import {MatTimepickerModule} from '@angular/material/timepicker';
import { Button } from '../../common-components/button/button';
import { FormsModule } from '@angular/forms';
import { NgIf, NgFor } from '@angular/common';
import { TaskService } from '../../services/task.service';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { Router, ActivatedRoute } from '@angular/router';
import { Task } from '../../models/task.model';

@Component({
  selector: 'app-edit-task-view',
  imports: [MatFormFieldModule, MatInputModule, MatSelectModule, MatCheckboxModule, MatDatepickerModule, Button, FormsModule,
    NgIf, MatTimepickerModule, MatChipsModule, MatIconModule, NgFor],
  templateUrl: './edit-task-view.html',
  styleUrl: './edit-task-view.scss',
  providers: [provideNativeDateAdapter()],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EditTaskView implements OnInit {
  task: Partial<Task> = {};
  tags: string[] = [];
  isRecurring = false;

  constructor(
    private taskService: TaskService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    const foundTask = this.taskService.getTaskById(id);
    if (foundTask) {
      this.task = { ...foundTask };
      this.isRecurring = !!this.task.recurring;
      this.tags = this.taskService.tasksSource.value
        .flatMap(t => t.tags)
        .filter((tag, i, arr) => arr.indexOf(tag) === i);
    }
  }

  saveTask() {
    if (this.task.id) {
      this.taskService.updateTask(this.task.id as number, this.task);
      this.router.navigate(['/list']);
    }
  }

  setRecurring(value: boolean) {
    this.isRecurring = value;
    if (value) {
      if (!this.task.recurring) {
        this.task.recurring = { frequency: 1, type: 'day' };
      }
    } else {
      this.task.recurring = null;
    }
  }
}
