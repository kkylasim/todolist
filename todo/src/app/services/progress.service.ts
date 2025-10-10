// progress.service.ts
// Service for managing user progress, levels, and milestones in the app.
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

// Progress state interface
export interface ProgressState {
  level: number; // Current user level
  tasksDone: number; // Total tasks completed
  tasksNeeded: number | null; // Tasks needed to level up
  hasLeveledUp?: boolean; // Flag for level up event
  milestoneHistory?: number[]; // Milestones for previous levels
  completedThisLevel?: number; // Tasks completed toward current level
}

const PROGRESS_KEY = 'progress';

@Injectable({ providedIn: 'root' })
export class ProgressService {
  // Default progress state
  private defaultState: ProgressState = {
    level: 1,
    tasksDone: 0,
    tasksNeeded: null,
    hasLeveledUp: false,
    milestoneHistory: [],
    completedThisLevel: 0
  };

  // Observable state source
  private stateSource = new BehaviorSubject<ProgressState>(this.loadState());
  state$ = this.stateSource.asObservable();

  // Load state from localStorage or use default
  private loadState(): ProgressState {
    const data = localStorage.getItem(PROGRESS_KEY);
    const state = data ? JSON.parse(data) : { ...this.defaultState };
    if (typeof state.hasLeveledUp === 'undefined') state.hasLeveledUp = false;
    return state;
  }

  // Save state to localStorage
  private saveState(state: ProgressState) {
    localStorage.setItem(PROGRESS_KEY, JSON.stringify(state));
  }

  // Get current state value
  getState(): ProgressState {
    return this.stateSource.value;
  }

  // Set and persist new state
  setState(state: ProgressState) {
    const newState = { ...state };
    this.stateSource.next(newState);
    this.saveState(newState);
  }

  // Level up user, reset progress for new level
  levelUp(level: number) {
    const state = this.getState();
    const milestoneHistory = [...(state.milestoneHistory || []), state.tasksNeeded || 0];
    this.setState({
      ...state,
      level,
      tasksDone: 0,
      hasLeveledUp: false,
      milestoneHistory,
      completedThisLevel: 0
      // tasksNeeded will be set by user via dialog
    });
  }

  // Set total tasks done
  setTasksDone(tasksDone: number) {
    const state = this.getState();
    this.setState({ ...state, tasksDone });
  }

  // Set level up flag
  setHasLeveledUp(flag: boolean) {
    const state = this.getState();
    this.setState({ ...state, hasLeveledUp: flag });
  }

  // Set tasks needed for next level
  setTasksNeeded(tasksNeeded: number | null) {
    const state = this.getState();
    this.setState({ ...state, tasksNeeded });
  }

  // Reset tasks needed to null
  resetTasksNeeded() {
    this.setTasksNeeded(null);
  }

  // Increment tasks completed toward current level
  incrementCompletedThisLevel() {
    const state = this.getState();
    this.setState({ ...state, completedThisLevel: (state.completedThisLevel || 0) + 1 });
  }

  // Decrement tasks completed toward current level
  decrementCompletedThisLevel() {
    const state = this.getState();
    this.setState({ ...state, completedThisLevel: Math.max((state.completedThisLevel || 0) - 1, 0) });
  }

  // Get milestone (tasks needed) for current level
  getCurrentMilestone(): number {
    const state = this.getState();
    return state.tasksNeeded || 0;
  }

  // Get progress (tasks completed) for current level
  getCurrentProgress(): number {
    const state = this.getState();
    return state.completedThisLevel || 0;
  }

  // Get total milestones from history
  getTotalMilestones(): number {
    const state = this.getState();
    return (state.milestoneHistory || []).reduce((sum, milestone) => sum + milestone, 0);
  }
}