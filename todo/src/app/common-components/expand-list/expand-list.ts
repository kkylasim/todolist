import {ChangeDetectionStrategy, Component, signal} from '@angular/core';
import {MatExpansionModule} from '@angular/material/expansion';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CommonModule } from '@angular/common';

interface PanelConfig {
  title: string;
  description: string;
  details: string;
  showCheckbox?: boolean;
}

@Component({
  selector: 'app-expand-list',
  imports: [MatExpansionModule,
    MatCheckboxModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    CommonModule
  ],
  templateUrl: './expand-list.html',
  styleUrl: './expand-list.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExpandList {
  readonly panelOpenState = signal(false);
  panels: PanelConfig[] = [
    {
      title: 'Task 1',
      description: '11.50pm',
      details: 'This is the description of Task 1.',
      showCheckbox: true,
    },
    {
      title: 'Task 2',
      description: '5.00pm',
      details: 'This is the description of Task 2.',
      showCheckbox: true,
    },
  ];

  onEdit(panel: PanelConfig) {
    console.log('Editing:', panel);
  }

  onDelete(panel: PanelConfig) {
    console.log('Deleting:', panel);
  }
}
