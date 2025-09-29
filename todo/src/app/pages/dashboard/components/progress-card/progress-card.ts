import { Component } from '@angular/core';
import {MatCardModule} from '@angular/material/card';
import { Button } from '../../../../common-components/button/button';
import { Chart } from '../chart/chart';

@Component({
  selector: 'app-progress-card',
  imports: [ MatCardModule, Button, Chart ],
  templateUrl: './progress-card.html',
  styleUrl: './progress-card.scss'
})
export class ProgressCard {

}
