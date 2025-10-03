import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import {MatCardModule} from '@angular/material/card';
import { Button } from '../../../../common-components/button/button';
import { Chart } from '../chart/chart';
import { Dialog } from '../dialog/dialog';
import {MatDialog, MatDialogModule} from '@angular/material/dialog';
import { TaskService } from '../../../../services/task.service';

@Component({
  selector: 'app-progress-card',
  imports: [ MatCardModule, Button, Chart , MatDialogModule ],
  templateUrl: './progress-card.html',
  styleUrl: './progress-card.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProgressCard {
  tasksDone = 0;
  tasksLeft = 0;
  tasksNeeded = 10;
  readonly dialog = inject(MatDialog);

  constructor(private taskService: TaskService) {
    this.taskService.todaysCompleted$.subscribe(tasks => {
      this.tasksDone = tasks.length;
      this.tasksLeft = Math.max(this.tasksNeeded - this.tasksDone, 0);
    });
  }

  openDialog() {
    const dialogRef = this.dialog.open(Dialog);

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }
}
