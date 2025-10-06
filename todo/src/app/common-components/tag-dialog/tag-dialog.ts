import {ChangeDetectionStrategy, Component} from '@angular/core';
import { NgFor } from '@angular/common';
import {MatButtonModule} from '@angular/material/button';
import {MatDialogModule} from '@angular/material/dialog';
import {MatChipsModule} from '@angular/material/chips';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { Button } from '../button/button'
import { TagService } from '../../services/tag.service';

@Component({
  selector: 'app-tag-dialog',
  imports: [NgFor, Button, MatButtonModule, MatDialogModule, MatChipsModule, MatInputModule, MatFormFieldModule, FormsModule, MatIconModule],
  templateUrl: './tag-dialog.html',
  styleUrl: './tag-dialog.scss'
})
export class TagDialog {
  tags: any[] = [];
  newTag: string = '';

  constructor(private tagService: TagService) {
    this.tagService.tags$.subscribe(tags => {
      this.tags = tags;
    });
  }

  addTag() {
    const trimmed = this.newTag.trim();
    if (trimmed && !this.tags.some(t => t.name === trimmed)) {
      const newTagObj = {
        id: Date.now(),
        name: trimmed,
        color: '#607D8B'
      };
      this.tagService.addTag(newTagObj);
    }
    this.newTag = '';
  }

  removeTag(tag: any) {
    this.tagService.deleteTag(tag.id);
  }
}
