import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface ProgressState {
  level: number;
  tasksDone: number;
  tasksNeeded: number | null;
  hasLeveledUp?: boolean;
  milestoneHistory?: number[]; // Array of milestones for previous levels
  completedThisLevel?: number; // Tasks completed toward current level
}

const PROGRESS_KEY = 'progress';

@Injectable({ providedIn: 'root' })
export class ProgressService {
  private defaultState: ProgressState = {
    level: 1,
    tasksDone: 0,
    tasksNeeded: null,
    hasLeveledUp: false,
    milestoneHistory: [],
    completedThisLevel: 0
  };
  private stateSource = new BehaviorSubject<ProgressState>(this.loadState());
  state$ = this.stateSource.asObservable();

  private loadState(): ProgressState {
    const data = localStorage.getItem(PROGRESS_KEY);
    const state = data ? JSON.parse(data) : { ...this.defaultState };
    if (typeof state.hasLeveledUp === 'undefined') state.hasLeveledUp = false;
    return state;
  }

  private saveState(state: ProgressState) {
    localStorage.setItem(PROGRESS_KEY, JSON.stringify(state));
  }

  getState(): ProgressState {
    return this.stateSource.value;
  }

  setState(state: ProgressState) {
    const newState = { ...state };
    this.stateSource.next(newState);
    this.saveState(newState);
  }

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

  setTasksDone(tasksDone: number) {
    const state = this.getState();
    this.setState({ ...state, tasksDone });
  }

  setHasLeveledUp(flag: boolean) {
    const state = this.getState();
    this.setState({ ...state, hasLeveledUp: flag });
  }

  setTasksNeeded(tasksNeeded: number | null) {
    const state = this.getState();
    this.setState({ ...state, tasksNeeded });
  }

  resetTasksNeeded() {
    this.setTasksNeeded(null);
  }

  incrementCompletedThisLevel() {
    const state = this.getState();
    this.setState({ ...state, completedThisLevel: (state.completedThisLevel || 0) + 1 });
    console.log(state.completedThisLevel);
  }

  decrementCompletedThisLevel() {
    const state = this.getState();
    this.setState({ ...state, completedThisLevel: Math.max((state.completedThisLevel || 0) - 1, 0) });
  }

  getCurrentMilestone(): number {
    const state = this.getState();
    return state.tasksNeeded || 0;
  }

  getCurrentProgress(): number {
    const state = this.getState();
    // console.log(state.completedThisLevel)
    return state.completedThisLevel || 0;
  }

  getTotalMilestones(): number {
    const state = this.getState();
    return (state.milestoneHistory || []).reduce((sum, milestone) => sum + milestone, 0);
  }
}