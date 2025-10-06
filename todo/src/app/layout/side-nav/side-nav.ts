import {Component, inject} from '@angular/core';
import {MatSidenavModule} from '@angular/material/sidenav';
import { Input, Output, EventEmitter } from "@angular/core";
import { MatIconModule } from "@angular/material/icon";
import { MatListModule } from "@angular/material/list";
import { MatTooltipModule } from "@angular/material/tooltip";
import { MatButtonModule } from "@angular/material/button";
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';  
import { MatDialog } from '@angular/material/dialog';
import { TagDialog } from '../../common-components/tag-dialog/tag-dialog';

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

  constructor(private dialog: MatDialog) {}

  openTagDialog() {
    this.dialog.open(TagDialog, {
      width: '400px'
    });
  }

  public routeLinks = [
    { link: "/dashboard", name: "Dashboard", icon: "dashboard" },
    { link: "/listView", name: "View All Tasks", icon: "account_balance" },
    // { link: "/calendarView", name: "CalendarView", icon: "account_balance" },
    { link: "/taskView", name: "Add Task", icon: "account_balance" },
    // { link: "/editTaskView/:id", name: "Edit Task", icon: "account_balance" }
  ];
}
