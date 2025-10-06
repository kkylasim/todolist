import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';

@Component({
  selector: 'app-level-up',
  imports: [MatIconModule, MatButtonModule, MatChipsModule],
  templateUrl: './level-up.html',
  styleUrl: './level-up.scss'
})
export class LevelUp {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { level: number, reward: { name: string } },
    private dialogRef: MatDialogRef<LevelUp>
  ) {}

  closeDialog() {
    this.dialogRef.close();
  }
}
