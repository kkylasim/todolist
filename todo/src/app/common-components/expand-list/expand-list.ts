import {ChangeDetectionStrategy, Component, signal} from '@angular/core';
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
import { Observable } from 'rxjs';

@Component({
  selector: 'app-expand-list',
  imports: [MatExpansionModule,
    MatCheckboxModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    CommonModule,
    MatChipsModule
  ],
  templateUrl: './expand-list.html',
  styleUrl: './expand-list.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExpandList {
  readonly panelOpenState = signal(false);
  panels$: Observable<Task[]>;

  constructor(private taskService: TaskService, private router: Router) {
    this.panels$ = this.taskService.filteredtasks$;
  }

  editTask(index: number) {
    this.router.navigate(['/taskView', index]);
  }

  onDelete(panel: Task) {
    console.log('Deleting:', panel);
  }
}
