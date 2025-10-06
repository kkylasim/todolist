import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface ProgressState {
  level: number;
  tasksDone: number;
  tasksNeeded: number;
  hasLeveledUp?: boolean;
}

const PROGRESS_KEY = 'progress';

@Injectable({ providedIn: 'root' })
export class ProgressService {
  private defaultState: ProgressState = { level: 1, tasksDone: 0, tasksNeeded: 2, hasLeveledUp: false };
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

  incrementLevel() {
    const state = this.getState();
    const newState = {
      ...state,
      level: state.level + 1,
      tasksDone: 0,
      tasksNeeded: state.tasksNeeded + 2,
      hasLeveledUp: false
    };
    this.setState(newState);
  }

  setTasksDone(tasksDone: number) {
    const state = this.getState();
    this.setState({ ...state, tasksDone });
  }

  setHasLeveledUp(flag: boolean) {
    const state = this.getState();
    this.setState({ ...state, hasLeveledUp: flag });
  }
}