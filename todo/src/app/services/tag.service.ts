import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Tag } from '../models/tag.model';

@Injectable({ providedIn: 'root' })
export class TagService {
  private tagsSubject = new BehaviorSubject<Tag[]>([]);
  tags$: Observable<Tag[]> = this.tagsSubject.asObservable();

  addTag(tag: Tag) {
    this.tagsSubject.next([...this.tagsSubject.value, tag]);
  }

  updateTag(updatedTag: Tag) {
    const tags = this.tagsSubject.value.map(t =>
      t.id === updatedTag.id ? updatedTag : t
    );
    this.tagsSubject.next(tags);
  }

  deleteTag(tagId: number) {
    const tags = this.tagsSubject.value.filter(t => t.id !== tagId);
    this.tagsSubject.next(tags);
  }

  getTagById(id: number) {
    return this.tagsSubject.value.find(t => t.id === id);
  }
}
