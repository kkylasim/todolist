import {ChangeDetectionStrategy, Component, signal, Input} from '@angular/core';
import {MatExpansionModule} from '@angular/material/expansion';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CommonModule } from '@angular/common';
import { TaskService } from '../../services/task.service';
import { Task } from '../../models/task.model';
import { MatChipsModule } from '@angular/material/chips';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs'; 
import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
  CdkDrag,
  CdkDropList,
} from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-expand-list',
  imports: [MatExpansionModule,
    MatCheckboxModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    CommonModule,
    MatChipsModule,
    CdkDropList, CdkDrag
  ],
  templateUrl: './expand-list.html',
  styleUrl: './expand-list.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExpandList {
  readonly panelOpenState = signal(false);

  @Input() panels: any[] | null | undefined = [];
  @Input() showTagsInHeader: boolean = false;

  constructor(private taskService: TaskService, private router: Router) {}

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

  editTask(panel: any) {
    this.router.navigate(['/editTaskView', panel.id]);
  }

  onDelete(panel: Task) {
    console.log(this.panels);
    console.log('Deleting:', panel);
  }
}