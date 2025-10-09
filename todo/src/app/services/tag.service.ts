import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Tag } from '../models/tag.model';
import { StorageService } from './storage.service';

const TAGS_KEY = 'tags';

@Injectable({ providedIn: 'root' })
export class TagService {
  private tags: Tag[] = [];
  public tagsSubject = new BehaviorSubject<Tag[]>([]);
  tags$ = this.tagsSubject.asObservable();

  constructor(private storage: StorageService) {
    // Load tags from localStorage or use dummy data if not present
    const storedTags = this.storage.getItem<Tag[]>(TAGS_KEY);
    if (storedTags && storedTags.length > 0) {
      this.tags = storedTags;
    } else {
      this.tags = [
        { id: 1, name: 'Personal', color: '#DD0031' },
        { id: 2, name: 'Work', color: '#4CAF50' },
        { id: 11, name: 'Health', color: '#795548' },
        { id: 12, name: 'Family', color: '#607D8B' }
      ];
      this.storage.setItem(TAGS_KEY, this.tags);
    }
    this.tagsSubject.next([...this.tags]);
  }

  // Create
  addTag(tag: Tag) {
    this.tags.push(tag);
    this.storage.setItem(TAGS_KEY, this.tags);
    this.tagsSubject.next([...this.tags]);
  }

  // Read
  getTagById(id: number): Tag | undefined {
    return this.tags.find(t => t.id === id);
  }

  // Update
  updateTag(id: number, updatedTag: Tag) {
    const idx = this.tags.findIndex(t => t.id === id);
    if (idx !== -1) {
      this.tags[idx] = { ...updatedTag };
      this.storage.setItem(TAGS_KEY, this.tags);
      this.tagsSubject.next([...this.tags]);
    }
  }

  // Delete
  deleteTag(id: number) {
    this.tags = this.tags.filter(t => t.id !== id);
    this.storage.setItem(TAGS_KEY, this.tags);
    this.tagsSubject.next([...this.tags]);
  }

  // Get all tags
  getAllTags(): Tag[] {
    return [...this.tags];
  }

  cleanUpUnusedTags(tasks: any[]) {
    // Collect all tag ids used by remaining tasks
    const usedTagIds = new Set<number>();
    tasks.forEach(task => {
      if (Array.isArray(task.tags)) {
        task.tags.forEach((tagId: number) => usedTagIds.add(tagId));
      }
    });
    // Remove tags not used by any task
    const allTags = [...this.tags];
    allTags.forEach(tag => {
      if (!usedTagIds.has(tag.id)) {
        this.deleteTag(tag.id);
      }
    });
  }
}
