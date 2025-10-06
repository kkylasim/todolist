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
        this.newTask.recurring = { frequency: 2, type: 'day' };
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

    // Ensure duedate is always a string in YYYY-MM-DD format (local)
    let baseDate: Date | null = null;
    if (this.newTask.duedate) {
      baseDate = typeof this.newTask.duedate === 'string' ? new Date(this.newTask.duedate) : this.newTask.duedate as Date;
      const year = baseDate.getFullYear();
      const month = String(baseDate.getMonth() + 1).padStart(2, '0');
      const day = String(baseDate.getDate()).padStart(2, '0');
      this.newTask.duedate = `${year}-${month}-${day}`;
    }
    // Ensure duetime is always a string in HH:mm format (local)
    let baseTime = '';
    if (this.newTask.duetime) {
      const timeObj = typeof this.newTask.duetime === 'string' ? new Date(`1970-01-01T${this.newTask.duetime}`) : this.newTask.duetime as Date;
      const hours = String(timeObj.getHours()).padStart(2, '0');
      const minutes = String(timeObj.getMinutes()).padStart(2, '0');
      baseTime = `${hours}:${minutes}`;
      this.newTask.duetime = baseTime;
    }

    // Recurring logic
    if (this.isRecurring && this.newTask.recurring && this.newTask.recurring.frequency > 1) {
      const tasksToCreate: Task[] = [];
      for (let i = 0; i < this.newTask.recurring.frequency; i++) {
        let dueDate: Date | null = baseDate ? new Date(baseDate) : null;
        if (dueDate) {
          if (i > 0) {
            switch (this.newTask.recurring.type) {
              case 'day':
                dueDate.setDate(dueDate.getDate() + i);
                break;
              case 'week':
                dueDate.setDate(dueDate.getDate() + i * 7);
                break;
              case 'month':
                dueDate.setMonth(dueDate.getMonth() + i);
                break;
              default:
                dueDate.setDate(dueDate.getDate() + i);
            }
          }
        }
        const year = dueDate ? dueDate.getFullYear() : '';
        const month = dueDate ? String(dueDate.getMonth() + 1).padStart(2, '0') : '';
        const day = dueDate ? String(dueDate.getDate()).padStart(2, '0') : '';
        const duedateStr = dueDate ? `${year}-${month}-${day}` : '';
        tasksToCreate.push({
          ...this.newTask,
          id: Date.now() + i, // Ensure unique ID
          duedate: duedateStr,
          duetime: baseTime,
          tags: [...this.selectedTags],
          recurring: this.newTask.recurring
        });
      }
      tasksToCreate.forEach(task => this.taskService.addTask(task));
    } else {
      // Single task
      const createdTask: Task = {
        ...this.newTask,
        id: Date.now(),
        tags: [...this.selectedTags],
      };
      this.taskService.addTask(createdTask);
    }

    // Reset form
    this.newTask = { id: Date.now(), title: '', status: 'Todo', description: '', duedate: '', duetime: '', recurring: null, tags: [] };
    this.selectedTags = [];
    this.router.navigate(['/listView']);
  }

  cancel() {
    this.resetForm();
    this.router.navigate(['/listView']);
  }

  resetForm() {
    this.newTask = { id: Date.now(), title: '', status: 'Todo', description: '', duedate: '', duetime: '', recurring: null, tags: [] };
    this.selectedTags = [];
  }

}
