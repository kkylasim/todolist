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
import { InputTaskDialog } from '../../../../common-components/input-task-dialog/input-task-dialog';

@Component({
  selector: 'app-progress-card',
  imports: [ MatCardModule, Button, Chart , MatDialogModule, LevelUp, InputTaskDialog ],
  templateUrl: './progress-card.html',
  styleUrl: './progress-card.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProgressCard {
  tasksDone = 0;
  tasksLeft = 0;
  tasksNeeded = 2;
  level = 1;
  totalCompleted = 0;
  readonly dialog = inject(MatDialog);
  private isLevelUpDialogOpen = false;
  private prevTasksLeft: number | null = null;
  private previousTasksNeeded: number | null = null;
  private isInputTaskDialogOpen = false;

  constructor(
    private taskService: TaskService,
    private rewardService: RewardService,
    private progressService: ProgressService,
    private cdr: ChangeDetectorRef
  ) {
    this.totalCompleted = this.taskService.getTotalCompletedCount();
    this.progressService.state$.subscribe((state: ProgressState) => {
      this.level = state.level;
      // Use milestone logic for progress bar
      this.tasksDone = this.progressService.getCurrentProgress();
      this.tasksNeeded = this.progressService.getCurrentMilestone() || 2;
      this.tasksLeft = Math.max(this.tasksNeeded - this.tasksDone, 0);
      this.totalCompleted = this.taskService.getTotalCompletedCount(); 
      this.cdr.markForCheck();
      // Only check level up if tasksLeft changed
      if (this.prevTasksLeft !== this.tasksLeft) {
        this.checkLevelUp(state.hasLeveledUp);
        this.prevTasksLeft = this.tasksLeft;
      }
      this.previousTasksNeeded = state.tasksNeeded;
      if (state.tasksNeeded == null && !this.isLevelUpDialogOpen && !this.isInputTaskDialogOpen) {
        this.openInputTaskDialog();
      }
    });
  }

  openInputTaskDialog() {
    this.isInputTaskDialogOpen = true;
    const dialogRef = this.dialog.open(InputTaskDialog, {
      disableClose: true,
      data: { previousTasksNeeded: this.previousTasksNeeded }
    });
    dialogRef.afterClosed().subscribe(result => {
      this.isInputTaskDialogOpen = false;
      if (result && typeof result === 'number' && result >= 2) {
        console.log('Setting tasksNeeded to:', result);
        this.progressService.setTasksNeeded(result);
        this.cdr.markForCheck();
      }
    });
  }

  levelUp() {
    this.isLevelUpDialogOpen = true;
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
      // After level up, open input task dialog for user to set tasksNeeded
      this.progressService.levelUp(this.level + 1);
      this.isLevelUpDialogOpen = false;
      this.openInputTaskDialog();
      this.cdr.detectChanges();
    });
  }

  checkLevelUp(hasLeveledUp?: boolean) {
    console.log('Checking level up:', { hasLeveledUp, tasksLeft: this.tasksLeft, isLevelUpDialogOpen: this.isLevelUpDialogOpen });
    if (this.isLevelUpDialogOpen) return; 
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
