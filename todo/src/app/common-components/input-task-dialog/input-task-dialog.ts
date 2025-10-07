import { Component, Inject } from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {MatDialogModule, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {MatChipsModule} from '@angular/material/chips';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { Button } from '../button/button'

@Component({
  selector: 'app-input-task-dialog',
  imports: [MatButtonModule, MatDialogModule, MatChipsModule, MatInputModule, MatFormFieldModule, FormsModule, MatIconModule],
  templateUrl: './input-task-dialog.html',
  styleUrl: './input-task-dialog.scss'
})
export class InputTaskDialog {
  tasksNeededInput: number | null;
  constructor(@Inject(MAT_DIALOG_DATA) public data: { previousTasksNeeded: number | null }) {
    this.tasksNeededInput = data?.previousTasksNeeded ?? null;
  }
}
