import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import {MatCardModule} from '@angular/material/card';
import { Button } from '../../../../common-components/button/button';
import { Chart } from '../chart/chart';
import { Dialog } from '../dialog/dialog';
import {MatDialog, MatDialogModule} from '@angular/material/dialog';
import { TaskService } from '../../../../services/task.service';
import { RewardService } from '../../../../services/reward.service';
import { ProgressService, ProgressState } from '../../../../services/progress.service';
import { LevelUp } from '../../../../common-components/level-up/level-up';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-progress-card',
  imports: [ MatCardModule, Button, Chart , MatDialogModule, LevelUp ],
  templateUrl: './progress-card.html',
  styleUrl: './progress-card.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProgressCard {
  tasksDone = 0;
  tasksLeft = 0;
  tasksNeeded = 1;
  level = 1;
  readonly dialog = inject(MatDialog);

  constructor(
    private taskService: TaskService,
    private rewardService: RewardService,
    private progressService: ProgressService,
    private cdr: ChangeDetectorRef
  ) {
    this.progressService.state$.subscribe((state: ProgressState) => {
      this.level = state.level;
      this.tasksDone = state.tasksDone;
      this.tasksNeeded = state.tasksNeeded || 1;
      this.tasksLeft = Math.max(this.tasksNeeded - this.tasksDone, 0);
      this.cdr.markForCheck();
      this.checkLevelUp(state.hasLeveledUp);
    });
  }

  levelUp() {
    this.progressService.setHasLeveledUp(true);
    // Default rewards
    const defaultRewards = [
      { id: 1, name: 'Treat' },
      { id: 2, name: 'Fun Activity' },
      { id: 3, name: 'Chill Day' }
    ];
    let allRewards = [...defaultRewards, ...this.rewardService.getRewards()];
    allRewards = allRewards.filter((reward, index, self) =>
      index === self.findIndex(r => r.name === reward.name)
    );
    const randomReward = allRewards[Math.floor(Math.random() * allRewards.length)];
    const dialogRef = this.dialog.open(LevelUp, {
      data: { level: this.level, reward: randomReward },
      disableClose: true
    });
    dialogRef.afterClosed().subscribe(() => {
      this.progressService.incrementLevel();
      // No need to reset hasLeveledUp here, handled in incrementLevel
    });
  }

  checkLevelUp(hasLeveledUp?: boolean) {
    if (this.tasksLeft === 0 && !hasLeveledUp) {
      this.levelUp();
    }
  }

  openDialog() {
    const dialogRef = this.dialog.open(Dialog);
    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }
}
