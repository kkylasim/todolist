import {Component, inject} from '@angular/core';
import {MatSidenavModule} from '@angular/material/sidenav';
import { Input, Output, EventEmitter } from "@angular/core";
import { MatIconModule } from "@angular/material/icon";
import { MatListModule } from "@angular/material/list";
import { MatTooltipModule } from "@angular/material/tooltip";
import { MatButtonModule } from "@angular/material/button";
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';  

@Component({
  selector: 'app-side-nav',
  templateUrl: './side-nav.html',
  styleUrl: './side-nav.scss',
  imports: [
    MatSidenavModule,
    MatIconModule,
    MatTooltipModule,
    MatListModule,
    MatButtonModule,
    RouterModule,
    CommonModule
  ]
})
export class SideNav {
  @Input() isExpanded: boolean = true;
  @Output() toggleMenu = new EventEmitter();

  public routeLinks = [
    { link: "/dashboard", name: "Dashboard", icon: "dashboard" },
    { link: "/listView", name: "ListView", icon: "account_balance" },
    { link: "/calendarView", name: "CalendarView", icon: "account_balance" },
    { link: "/taskView", name: "TaskView", icon: "account_balance" },
  ];
}
