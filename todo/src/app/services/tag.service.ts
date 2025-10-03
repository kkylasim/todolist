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
        { id: 1, name: 'Angular', color: '#DD0031' },
        { id: 2, name: 'Writing', color: '#FFD700' },
        { id: 3, name: 'Meeting', color: '#2196F3' },
        { id: 4, name: 'Team', color: '#4CAF50' },
        { id: 5, name: 'Code', color: '#9C27B0' },
        { id: 6, name: 'Review', color: '#FF5722' },
        { id: 7, name: 'Blog', color: '#FF9800' },
        { id: 8, name: 'Design', color: '#E91E63' },
        { id: 9, name: 'UI', color: '#00BCD4' },
        { id: 10, name: 'Presentation', color: '#8BC34A' },
        { id: 11, name: 'Client', color: '#795548' },
        { id: 12, name: 'Deployment', color: '#607D8B' },
        { id: 13, name: 'Release', color: '#F44336' }
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
