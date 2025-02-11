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
import {
  URL_ADMIN_CLIENTS_EDIT,
  URL_ADMIN_CLIENTS_EXCEL,
  URL_ADMIN_CLIENTS_MAIN,
} from '@globals';
import { BreadcrumbComponent } from 'xng-breadcrumb';
import { slideInAnimation } from '../../../../shared/animation';
import { PestaniaLabelComponent } from '../../../../shared/components/pestania-label/pestania-label.component';

@Component({
  selector: 'app-customer-administration',
  imports: [
    MatTabLink,
    MatTabNav,
    MatTabNavPanel,
    PestaniaLabelComponent,
    RouterLinkActive,
    RouterOutlet,
    NgClass,
    RouterLink,
    BreadcrumbComponent,
    MatIcon,
    TitleCasePipe,
  ],
  templateUrl: './customer-administration.component.html',
  styleUrl: './customer-administration.component.scss',
  animations: [slideInAnimation],
})
export class CustomerAdministrationComponent implements OnInit, OnDestroy {
  public clientsTitle!: string;
  public editClientTitle!: string;
  public editClientsExcelTitle!: string;
  public clientsIcon!: string;
  public editClientIcon!: string;
  public editClientsExcelIcon!: string;

  public animationState: number;

  @ViewChild(MatTabNav, { static: true }) navigation!: MatTabNav;

  private route: ActivatedRoute = inject(ActivatedRoute);

  protected readonly URL_ADMIN_CLIENTS_MAIN = URL_ADMIN_CLIENTS_MAIN;
  protected readonly URL_ADMIN_CLIENTS_EDIT = URL_ADMIN_CLIENTS_EDIT;
  protected readonly URL_ADMIN_CLIENTS_EXCEL = URL_ADMIN_CLIENTS_EXCEL;

  constructor() {
    this.clientsTitle = 'Clientes';
    this.editClientTitle = 'Editar Cliente';
    this.editClientsExcelTitle = 'Excel Clientes';
    this.clientsIcon = 'clients-icon.png';
    this.editClientIcon = 'client-edit-icon.png';
    this.editClientsExcelIcon = 'excel-icon.png';
    this.animationState = 0;
  }

  ngOnInit() {}

  ngOnDestroy(): void {}

  onActivate($event: any) {
    this.animationState = this.route?.firstChild?.snapshot.data['routeIdx'];
  }
}
