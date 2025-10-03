import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SideNav } from './side-nav/side-nav';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-layout',
  standalone: true,
  styles: [
    `
      .content-container {
        min-height: 100vh;
        box-sizing: border-box;
        padding: 25px;
      }
      .mat-sidenav {
        width: 300px
      }
    `,
  ],
  imports: [
    RouterOutlet,
    SideNav,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    MatTooltipModule,
    MatButtonModule,
  ],
  template: `<mat-sidenav-container autosize>
      <mat-sidenav
        #sidenav
        fixedInViewport="true"
        mode="side"
        opened="{{ isExpanded }}"
      >
        <app-side-nav
          (toggleMenu)="toggleMenu()"
          [isExpanded]="isExpanded"
        ></app-side-nav>
      </mat-sidenav>

      <mat-sidenav-content [style.margin-left.px]="!isExpanded ? 60 : 300">
        <div class="content-container">
          <router-outlet></router-outlet>
        </div>
      </mat-sidenav-content>
    </mat-sidenav-container>`
})
export class AppLayout {
  public isExpanded = true;

  public toggleMenu() {
    this.isExpanded = !this.isExpanded;
  }
}
