import { Component, ChangeDetectionStrategy } from '@angular/core';
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
import { Router } from '@angular/router';

@Component({
  selector: 'app-task-view',
  imports: [MatFormFieldModule, MatInputModule, MatSelectModule, MatCheckboxModule, MatDatepickerModule, Button, FormsModule,
    NgIf, MatTimepickerModule, MatChipsModule, MatIconModule, NgFor
  ],
  templateUrl: './task-view.html',
  styleUrl: './task-view.scss',
  providers: [provideNativeDateAdapter()],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TaskView {
  isRecurring = false;

  tags: string[] = ['tag1', 'tag2', 'tag3', 'tag4'];

  selectedTags: string[] = [];

  toggleTag(tag: string) {
    const index = this.selectedTags.indexOf(tag);
    if (index === -1) {
      this.selectedTags.push(tag);
    } else {
      this.selectedTags.splice(index, 1);
    }
  }

  newTask = { title: '', description: '', duedate: '', duetime: '', recurring: {frequency: 0, type: ''}, tags: [], showCheckbox: true };

  constructor(private taskService: TaskService, 
    private router: Router) {}

  addTask() {
    if (!this.newTask.title) return;
    this.taskService.addTask({ ...this.newTask });
    this.newTask = { title: '', description: '', tags: [], duedate: '', recurring: {frequency: 0, type: ''}, duetime: '', showCheckbox: true };
    this.router.navigate(['/listView']);
  }
}
