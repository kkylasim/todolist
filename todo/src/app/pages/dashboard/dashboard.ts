import { Component } from '@angular/core';
import { ProgressCard } from './components/progress-card/progress-card';
import { TaskCard } from './components/task-card/task-card';

@Component({
  selector: 'app-dashboard',
  imports: [ ProgressCard, TaskCard ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss'
})
export class Dashboard {

}
