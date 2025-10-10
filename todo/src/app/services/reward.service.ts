import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Reward } from '../models/reward.model';

@Injectable({ providedIn: 'root' })
export class RewardService {
  // Observable source for rewards state
  private rewardsSource = new BehaviorSubject<Reward[]>(this.loadRewards());
  rewards$ = this.rewardsSource.asObservable();

  // Load rewards from localStorage
  private loadRewards(): Reward[] {
    const data = localStorage.getItem('rewards');
    return data ? JSON.parse(data) : [];
  }

  // Save rewards to localStorage
  private saveRewards(rewards: Reward[]) {
    localStorage.setItem('rewards', JSON.stringify(rewards));
  }

  // Get current rewards list
  getRewards(): Reward[] {
    return this.rewardsSource.value;
  }

  // Add a new reward
  addReward(reward: Reward) {
    const rewards = [...this.rewardsSource.value, reward];
    this.rewardsSource.next(rewards);
    this.saveRewards(rewards);
  }

  // Edit an existing reward by id
  editReward(id: number, updated: Partial<Reward>) {
    const rewards = this.rewardsSource.value.map(r =>
      r.id === id ? { ...r, ...updated } : r
    );
    this.rewardsSource.next(rewards);
    this.saveRewards(rewards);
  }

  // Delete a reward by id
  deleteReward(id: number) {
    const rewards = this.rewardsSource.value.filter(r => r.id !== id);
    this.rewardsSource.next(rewards);
    this.saveRewards(rewards);
  }
}