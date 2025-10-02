import { Component } from '@angular/core';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import {MatSelectModule} from '@angular/material/select';
import { ExpandList } from '../../common-components/expand-list/expand-list';
import { NgFor, NgIf } from '@angular/common';
import { MatChipsModule } from '@angular/material/chips';
import { FormsModule } from '@angular/forms'; 
import { TaskService } from '../../services/task.service';

@Component({
  selector: 'app-list-view',
  imports: [MatInputModule, MatFormFieldModule, MatIconModule, ExpandList, MatSelectModule, NgFor, NgIf, MatChipsModule, FormsModule],
  templateUrl: './list-view.html',
  styleUrl: './list-view.scss'
})
export class ListView {
  searchTerm: string = '';

  tasks: any[] = [];

  constructor(private taskService: TaskService) {
    this.taskService.filteredtasks$.subscribe(tasks => {
      this.tasks = tasks;
    });
  }

  onSearch() {
    this.taskService.setSearchTerm(this.searchTerm);
  }

  clearSearch() {
    this.searchTerm = '';
    this.taskService.setSearchTerm('');
  }

  tags: string[] = ['tag1', 'tag2', 'tag3', 'tag4'];
  selectedTags: string[] = [];

  toggleTag(tag: string) {
    const index = this.selectedTags.indexOf(tag);
    if (index === -1) {
      this.selectedTags.push(tag);
    } else {
      this.selectedTags.splice(index, 1);
    }
  }
}
