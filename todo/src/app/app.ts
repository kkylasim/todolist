import { Component, signal } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';

// material
import { MatSidenavModule } from "@angular/material/sidenav";
import { MatIconModule } from "@angular/material/icon";
import { MatListModule } from "@angular/material/list";
import { MatTooltipModule } from "@angular/material/tooltip";
import { MatButtonModule } from "@angular/material/button";

//components
import { AppLayout } from './layout/app-layout';


@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, AppLayout,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    MatTooltipModule,
    MatButtonModule
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('todo');
}
