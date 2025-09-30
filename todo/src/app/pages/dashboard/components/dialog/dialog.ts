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

@Component({
  selector: 'app-dialog',
  imports: [MatDialogModule, MatButtonModule, MatChipsModule, MatInputModule, MatFormFieldModule, Button, NgFor, MatIconModule, FormsModule],
  templateUrl: './dialog.html',
  styleUrl: './dialog.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Dialog {
  rewards: string[] = ['r1', 'r2', 'r3', 'r4'];
  newReward: string = '';

  removeReward(reward: string) {
    this.rewards = this.rewards.filter(r => r !== reward);
  }

  addReward() {
    const trimmed = this.newReward.trim();
    if (trimmed && !this.rewards.includes(trimmed)) {
      this.rewards.push(trimmed);
    }
    this.newReward = '';
  }
}
