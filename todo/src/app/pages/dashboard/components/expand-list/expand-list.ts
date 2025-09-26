import {ChangeDetectionStrategy, Component, signal} from '@angular/core';
import {MatExpansionModule} from '@angular/material/expansion';

@Component({
  selector: 'app-expand-list',
  imports: [MatExpansionModule],
  templateUrl: './expand-list.html',
  styleUrl: './expand-list.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExpandList {
  readonly panelOpenState = signal(false);
}
