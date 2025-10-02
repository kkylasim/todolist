import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Reward } from '../models/reward.model';

@Injectable({ providedIn: 'root' })
export class RewardService {
  private rewardsSource = new BehaviorSubject<Reward[]>(this.loadRewards());
  rewards$ = this.rewardsSource.asObservable();

  private loadRewards(): Reward[] {
    const data = localStorage.getItem('rewards');
    return data ? JSON.parse(data) : [];
  }

  private saveRewards(rewards: Reward[]) {
    localStorage.setItem('rewards', JSON.stringify(rewards));
  }

  getRewards(): Reward[] {
    return this.rewardsSource.value;
  }

  addReward(reward: Reward) {
    const rewards = [...this.rewardsSource.value, reward];
    this.rewardsSource.next(rewards);
    this.saveRewards(rewards);
  }

  editReward(id: number, updated: Partial<Reward>) {
    const rewards = this.rewardsSource.value.map(r =>
      r.id === id ? { ...r, ...updated } : r
    );
    this.rewardsSource.next(rewards);
    this.saveRewards(rewards);
  }

  deleteReward(id: number) {
    const rewards = this.rewardsSource.value.filter(r => r.id !== id);
    this.rewardsSource.next(rewards);
    this.saveRewards(rewards);
  }
}