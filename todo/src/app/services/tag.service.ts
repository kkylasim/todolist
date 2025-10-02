import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Tag } from '../models/tag.model';
import { TaskService } from './task.service';

@Injectable({ providedIn: 'root' })
export class TagService {
  private tagsSubject = new BehaviorSubject<Tag[]>([]);
  tags$: Observable<Tag[]> = this.tagsSubject.asObservable();

  constructor(private taskService: TaskService) {
    // Initialize tags from TaskService's initialTags
    this.tagsSubject.next([...this.taskService.initialTags]);
  }

  addTag(tag: Tag) {
    const tags = this.tagsSubject.value;
    if (!tags.some(t => t.name === tag.name)) {
      this.tagsSubject.next([...tags, tag]);
    }
  }

  updateTag(updatedTag: Tag) {
    const tags = this.tagsSubject.value.map(t => t.id === updatedTag.id ? updatedTag : t);
    this.tagsSubject.next(tags);
    // Update all tasks that reference this tag id
    const updatedTasks = this.taskService.tasksSource.value.map(task => {
      if (task.tags && task.tags.includes(updatedTag.id)) {
        return { ...task };
      }
      return task;
    });
    this.taskService.tasksSource.next(updatedTasks);
  }

  deleteTag(tagId: number) {
    const tags = this.tagsSubject.value.filter(t => t.id !== tagId);
    this.tagsSubject.next(tags);
    // Remove tag id from all tasks
    const updatedTasks = this.taskService.tasksSource.value.map(task => {
      if (task.tags && task.tags.includes(tagId)) {
        return {
          ...task,
          tags: task.tags.filter((tid: number) => tid !== tagId)
        };
      }
      return task;
    });
    this.taskService.tasksSource.next(updatedTasks);
  }

  getTagById(id: number): Tag | undefined {
    return this.tagsSubject.value.find(t => t.id === id);
  }
}
