import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import {MatCardModule} from '@angular/material/card';
import { Button } from '../../../../common-components/button/button';
import { Chart } from '../chart/chart';
import { Dialog } from '../dialog/dialog';
import {MatDialog, MatDialogModule} from '@angular/material/dialog';

@Component({
  selector: 'app-progress-card',
  imports: [ MatCardModule, Button, Chart , MatDialogModule ],
  templateUrl: './progress-card.html',
  styleUrl: './progress-card.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProgressCard {
  taskNumber = 3;
  readonly dialog = inject(MatDialog);

  openDialog() {
    const dialogRef = this.dialog.open(Dialog);

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }
}
