import { Component } from '@angular/core';
import {MatCardModule} from '@angular/material/card';
import { ExpandList } from '../expand-list/expand-list';
import { Button } from '../../../../common-components/button/button';

@Component({
  selector: 'app-task-card',
  imports: [ MatCardModule, ExpandList, Button ],
  templateUrl: './task-card.html',
  styleUrl: './task-card.scss'
})
export class TaskCard {

}
