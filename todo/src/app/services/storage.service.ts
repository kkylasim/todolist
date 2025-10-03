import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class StorageService {
  // Save data to localStorage
  setItem<T>(key: string, value: T): void {
    localStorage.setItem(key, JSON.stringify(value));
  }

  // Get data from localStorage
  getItem<T>(key: string): T | null {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) as T : null;
  }

  // Remove data from localStorage
  removeItem(key: string): void {
    localStorage.removeItem(key);
  }

  // Update data in localStorage (same as setItem)
  updateItem<T>(key: string, value: T): void {
    this.setItem(key, value);
  }

  // Get all keys in localStorage
  getAllKeys(): string[] {
    return Object.keys(localStorage);
  }
}
