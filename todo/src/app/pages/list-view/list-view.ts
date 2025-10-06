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
import { TagService } from '../../services/tag.service';

@Component({
  selector: 'app-list-view',
  imports: [MatInputModule, MatFormFieldModule, MatIconModule, ExpandList, MatSelectModule, NgFor, NgIf, MatChipsModule, FormsModule],
  templateUrl: './list-view.html',
  styleUrl: './list-view.scss'
})
export class ListView {
  searchTerm: string = '';

  tasks: any[] = [];
  tags: any[] = [];
  selectedTags: number[] = [];
  selectedStatus: string[] = [];

  filterTasksByTags(tasks: any[]): any[] {
    if (this.selectedTags.length === 0) return tasks;
    return tasks.filter(task =>
      task.tags && task.tags.some((tagId: number) => this.selectedTags.includes(tagId))
    );
  }

  filterTasksByStatus(tasks: any[]): any[] {
    if (this.selectedStatus.length === 0) return tasks;
    return tasks.filter(task => {
      const statusMap: { [key: string]: string } = {
        'To do': 'Todo',
        'In progress': 'Progress',
        'Completed': 'Complete'
      };
      return this.selectedStatus.includes(Object.keys(statusMap).find(key => statusMap[key] === task.status) || '');
    });
  }

  filterTasks(tasks: any[]): any[] {
    let filtered = this.filterTasksByTags(tasks);
    filtered = this.filterTasksByStatus(filtered);
    return filtered;
  }

  constructor(private taskService: TaskService, private tagService: TagService) {
    this.taskService.filteredtasks$.subscribe(tasks => {
      this.tasks = this.filterTasks(tasks);
    });
    this.tagService.tags$.subscribe(tags => {
      this.tags = tags;
    });
  }

  onSearch() {
    this.taskService.setSearchTerm(this.searchTerm);
  }

  clearSearch() {
    this.searchTerm = '';
    this.taskService.setSearchTerm('');
  }

  onStatusSelectionChange() {
    this.taskService.filteredtasks$.subscribe(tasks => {
      this.tasks = this.filterTasks(tasks);
    });
  }

  onTagSelectionChange() {
    this.taskService.filteredtasks$.subscribe(tasks => {
      this.tasks = this.filterTasks(tasks);
    });
  }

  toggleTag(tagId: number) {
    const index = this.selectedTags.indexOf(tagId);
    if (index === -1) {
      this.selectedTags.push(tagId);
    } else {
      this.selectedTags.splice(index, 1);
    }
    this.onTagSelectionChange();
  }
}
