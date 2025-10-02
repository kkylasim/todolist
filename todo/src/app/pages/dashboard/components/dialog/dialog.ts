import {ChangeDetectionStrategy, Component} from '@angular/core';
import { NgFor } from '@angular/common';
import {MatButtonModule} from '@angular/material/button';
import {MatDialogModule} from '@angular/material/dialog';
import {MatChipsModule} from '@angular/material/chips';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { Button } from '../../../../common-components/button/button';
import { RewardService } from '../../../../services/reward.service';
import { Reward } from '../../../../models/reward.model';

@Component({
  selector: 'app-dialog',
  imports: [MatDialogModule, MatButtonModule, MatChipsModule, MatInputModule, MatFormFieldModule, Button, NgFor, MatIconModule, FormsModule],
  templateUrl: './dialog.html',
  styleUrl: './dialog.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Dialog {
  rewards: Reward[] = [];
  newReward: string = '';

  constructor(private rewardService: RewardService) {
    this.rewardService.rewards$.subscribe(rewards => {
      this.rewards = rewards;
    });
  }

  removeReward(reward: Reward) {
    this.rewardService.deleteReward(reward.id);
  }

  addReward() {
    const trimmed = this.newReward.trim();
    if (trimmed && !this.rewards.some(r => r.name === trimmed)) {
      const newRewardObj: Reward = {
        id: Date.now(), 
        name: trimmed
      };
      this.rewardService.addReward(newRewardObj);
    }
    this.newReward = '';
  }
}
