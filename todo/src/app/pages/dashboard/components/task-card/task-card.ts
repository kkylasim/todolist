import { Component } from '@angular/core';
import {MatCardModule} from '@angular/material/card';
import { ExpandList } from '../../../../common-components/expand-list/expand-list';
import { Button } from '../../../../common-components/button/button';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-task-card',
  imports: [ MatCardModule, ExpandList, Button, RouterLink ],
  templateUrl: './task-card.html',
  styleUrl: './task-card.scss'
})
export class TaskCard {

}
