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
  tags: string[] = ['Angular', 'Material', 'Dashboard', 'Tasks'];
  newTag: string = '';

  removeTag(tag: string) {
    this.tags = this.tags.filter(t => t !== tag);
  }

  addTag() {
    const trimmed = this.newTag.trim();
    if (trimmed && !this.tags.includes(trimmed)) {
      this.tags.push(trimmed);
    }
    this.newTag = '';
  }
}
