import {ChangeDetectionStrategy, Component, signal, Input, inject, OnInit, OnChanges, SimpleChanges} from '@angular/core';
import {MatExpansionModule} from '@angular/material/expansion';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CommonModule } from '@angular/common';
import { TaskService } from '../../services/task.service';
import { MatChipsModule } from '@angular/material/chips';
import { Router } from '@angular/router';
import { TagService } from '../../services/tag.service';
import { Tag } from '../../models/tag.model';
import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
  CdkDrag,
  CdkDropList,
} from '@angular/cdk/drag-drop';
import { ConfirmDialog } from '../confirm-dialog/confirm-dialog';
import {MatDialog, MatDialogModule} from '@angular/material/dialog';

@Component({
  selector: 'app-expand-list',
  imports: [MatExpansionModule,
    MatCheckboxModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    CommonModule,
    MatChipsModule,
    CdkDropList, CdkDrag, ConfirmDialog,
    MatDialogModule
  ],
  templateUrl: './expand-list.html',
  styleUrl: './expand-list.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExpandList implements OnInit, OnChanges {
  readonly panelOpenState = signal(false);
  tags: Tag[] = [];
  showDeleteDialog = false;
  taskToDelete: any = null;

  @Input() panels: any[] | null | undefined = [];
  @Input() showTagsInHeader: boolean = false;

  constructor(private taskService: TaskService, private tagService: TagService, private router: Router, private dialog: MatDialog) {
    this.tagService.tags$.subscribe(tags => {
      this.tags = tags;
    });
  }

  ngOnInit() {
    this.checkAndUpdateOverdueTasks();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['panels']) {
      this.checkAndUpdateOverdueTasks();
    }
  }

  checkAndUpdateOverdueTasks() {
    if (!this.panels) return;
    const now = new Date();
    this.panels.forEach(task => {
      if (task.status !== 'Complete') {
        const dueDateTime = this.getDueDateTime(task);
        if (dueDateTime) {
          if (dueDateTime < now) {
            if (task.status !== 'Overdue') {
              task.status = 'Overdue';
              this.taskService.updateTask(task.id, { ...task, status: 'Overdue' });
            }
          } else {
            // If the task was previously overdue but now has a future or today due date, reset to Todo
            if (task.status === 'Overdue') {
              task.status = 'Todo';
              this.taskService.updateTask(task.id, { ...task, status: 'Todo' });
            }
          }
        }
      }
    });
  }

  drop(event: CdkDragDrop<any[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      const movedTask = event.previousContainer.data[event.previousIndex];
      console.log('ExpandList drop:', {
        id: movedTask.id,
        prevStatus: movedTask.status,
        prevDueDate: movedTask.duedate,
        targetList: event.container.id
      });
      if (event.container.id === 'todoList') {
        movedTask.status = 'Todo';
      } else if (event.container.id === 'inProgressList') {
        movedTask.status = 'Progress';
      } else if (event.container.id === 'doneList') {
        movedTask.status = 'Complete';
      }
      console.log('ExpandList updating task:', movedTask);
      this.taskService.updateTask(movedTask.id, movedTask);
    }
  }

  getDueDateTime(panel: any): Date | null {
    // If duedate is a Date object (from datepicker), format it to YYYY-MM-DD
    let dateStr = '';
    if (panel.duedate instanceof Date) {
      // Format to YYYY-MM-DD
      const year = panel.duedate.getFullYear();
      const month = String(panel.duedate.getMonth() + 1).padStart(2, '0');
      const day = String(panel.duedate.getDate()).padStart(2, '0');
      dateStr = `${year}-${month}-${day}`;
    } else if (typeof panel.duedate === 'string' && panel.duedate.match(/^\d{4}-\d{2}-\d{2}$/)) {
      dateStr = panel.duedate;
    } else {
      return null;
    }

    // duetime should be HH:mm
    let timeStr = '';
    if (typeof panel.duetime === 'string' && panel.duetime.match(/^\d{2}:\d{2}$/)) {
      timeStr = panel.duetime;
    } else if (panel.duetime instanceof Date) {
      // If duetime is a Date object, get hours and minutes
      const hours = String(panel.duetime.getHours()).padStart(2, '0');
      const minutes = String(panel.duetime.getMinutes()).padStart(2, '0');
      timeStr = `${hours}:${minutes}`;
    } else {
      return null;
    }

    // Combine and return as Date
    const dateTimeString = `${dateStr}T${timeStr}:00`;
    const dateObj = new Date(dateTimeString);
    return isNaN(dateObj.getTime()) ? null : dateObj;
  }

  getPanelTags(panel: any): Tag[] {
    if (!panel.tags || !this.tags) return [];
    return panel.tags.map((id: number) => this.tags.find(tag => tag.id === id)).filter(Boolean) as Tag[];
  }

  getStatusClass(panel: any): string {
    switch (panel.status) {
      case 'Complete':
        return 'status-complete'; // green
      case 'Progress':
        return 'status-progress'; // orange
      case 'Todo':
        return 'status-todo'; // red
      case 'Overdue':
        return 'status-overdue'; // grey
      default:
        return '';
    }
  }

  editTask(panel: any) {
    this.router.navigate(['/editTaskView', panel.id]);
  }

  onDeleteClick(panel: any) {
    const dialogRef = this.dialog.open(ConfirmDialog);
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.taskService.deleteTask(panel.id);
        this.tagService.cleanUpUnusedTags(this.taskService.tasksSource.value);
      }
    });
  }
}