import {Component, inject} from '@angular/core';
import {MatSidenavModule} from '@angular/material/sidenav';
import { Input, Output, EventEmitter } from "@angular/core";
import { MatIconModule } from "@angular/material/icon";
import { MatListModule } from "@angular/material/list";
import { MatTooltipModule } from "@angular/material/tooltip";
import { MatButtonModule } from "@angular/material/button";
import { RouterModule } from '@angular/router';


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
    RouterModule
  ]
})
export class SideNav {
  @Input() isExpanded: boolean = true;
  @Output() toggleMenu = new EventEmitter();

  public routeLinks = [
    { link: "/", name: "Dashboard", icon: "dashboard" },
    { link: "/listView", name: "ListView", icon: "account_balance" },
  ];
}
