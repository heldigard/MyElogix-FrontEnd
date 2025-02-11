import { NgClass, TitleCasePipe } from '@angular/common';
import { Component, inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { MatTabLink, MatTabNav, MatTabNavPanel } from '@angular/material/tabs';
import {
  ActivatedRoute,
  RouterLink,
  RouterLinkActive,
  RouterOutlet,
} from '@angular/router';
import { URL_ADMIN_USERS_EXCEL, URL_ADMIN_USERS_MAIN } from '@globals';
import { BreadcrumbComponent, BreadcrumbItemDirective } from 'xng-breadcrumb';
import { slideInAnimation } from '../../../../shared/animation';
import { PestaniaLabelComponent } from '../../../../shared/components/pestania-label/pestania-label.component';

@Component({
  selector: 'app-user-administration',
  imports: [
    BreadcrumbComponent,
    BreadcrumbItemDirective,
    MatIcon,
    MatTabLink,
    MatTabNav,
    MatTabNavPanel,
    PestaniaLabelComponent,
    TitleCasePipe,
    RouterOutlet,
    RouterLink,
    NgClass,
    RouterLinkActive,
  ],
  templateUrl: './user-administration.component.html',
  styleUrl: './user-administration.component.scss',
  animations: [slideInAnimation],
})
export class UserAdministrationComponent implements OnInit, OnDestroy {
  public usersTitle!: string;
  public editUsersExcelTitle!: string;
  public usersIcon!: string;
  public editUserIcon!: string;
  public editUsersExcelIcon!: string;

  public animationState: number;

  @ViewChild(MatTabNav, { static: true }) navigation!: MatTabNav;

  private route: ActivatedRoute = inject(ActivatedRoute);

  protected readonly URL_ADMIN_USERS_MAIN = URL_ADMIN_USERS_MAIN;
  protected readonly URL_ADMIN_USERS_EXCEL = URL_ADMIN_USERS_EXCEL;

  constructor() {
    this.usersTitle = 'Usuarios';
    this.editUsersExcelTitle = 'Usuarios Excel';
    this.usersIcon = 'users-icon.png';
    this.editUserIcon = 'user-edit-icon.png';
    this.editUsersExcelIcon = 'excel-icon.png';
    this.animationState = 0;
  }

  ngOnInit() {}

  ngOnDestroy(): void {}

  onActivate($event: any) {
    this.animationState = this.route?.firstChild?.snapshot.data['routeIdx'];
  }
}
