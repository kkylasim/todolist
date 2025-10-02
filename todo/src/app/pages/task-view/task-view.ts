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
import { Router, ActivatedRoute } from '@angular/router';
import { Task } from '../../models/task.model';
import { TagService } from '../../services/tag.service';

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

  tags: any[] = [];

  selectedTags: number[] = [];

  newTask: Task = { id: Date.now(), title: '', status: 'Todo', description: '', duedate: '', duetime: '', recurring: null, tags: [] as number[] };

  toggleTag(tagId: number) {
    const index = this.selectedTags.indexOf(tagId);
    if (index === -1) {
      this.selectedTags.push(tagId);
    } else {
      this.selectedTags.splice(index, 1);
    }
  }

  setRecurring(value: boolean) {
    this.isRecurring = value;
    if (value) {
      if (!this.newTask.recurring) {
        this.newTask.recurring = { frequency: 1, type: 'day' };
      }
    } else {
      this.newTask.recurring = null;
    }
  }

  constructor(private taskService: TaskService,
    private router: Router, private route: ActivatedRoute, private tagService: TagService) {
      this.tagService.tags$.subscribe(tags => {
        this.tags = tags;
      });
    }

  addTask() {
    // Prevent adding a task without a title
    if (!this.newTask.title) return;

    // Always create a new unique ID for the new task
    const createdTask: Task = {
      ...this.newTask,
      id: Date.now(), // Use current timestamp for unique ID
      tags: [...this.selectedTags], // Save selected tag ids
    };

    // Add the new task using the service
    this.taskService.addTask(createdTask);

    // Optionally reset the form fields after creation
    this.newTask = { id: Date.now(), title: '', status: 'Todo', description: '', duedate: '', duetime: '', recurring: null, tags: [] };
    this.selectedTags = [];

    // Navigate to the list view after creating the task
    this.router.navigate(['/listView']);
  }
}
