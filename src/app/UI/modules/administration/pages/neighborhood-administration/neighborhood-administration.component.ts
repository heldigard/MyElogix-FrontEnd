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
  URL_ADMIN_NEIGHBORHOODS_EXCEL,
  URL_ADMIN_NEIGHBORHOODS_MAIN,
} from '@globals';
import { BreadcrumbComponent, BreadcrumbItemDirective } from 'xng-breadcrumb';
import { slideInAnimation } from '../../../../shared/animation';
import { PestaniaLabelComponent } from '../../../../shared/components/pestania-label/pestania-label.component';

@Component({
  selector: 'app-neighborhood-administration',
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
  templateUrl: './neighborhood-administration.component.html',
  styleUrl: './neighborhood-administration.component.scss',
  animations: [slideInAnimation],
})
export class NeighborhoodAdministrationComponent implements OnInit, OnDestroy {
  public neighborhoodsTitle!: string;
  public editNeighborhoodsExcelTitle!: string;
  public neighborhoodsIcon!: string;
  public editNeighborhoodIcon!: string;
  public editNeighborhoodsExcelIcon!: string;

  public animationState: number;

  @ViewChild(MatTabNav, { static: true }) navigation!: MatTabNav;

  private route: ActivatedRoute = inject(ActivatedRoute);

  protected readonly URL_ADMIN_NEIGHBORHOODS_MAIN =
    URL_ADMIN_NEIGHBORHOODS_MAIN;
  protected readonly URL_ADMIN_NEIGHBORHOODS_EXCEL =
    URL_ADMIN_NEIGHBORHOODS_EXCEL;

  constructor() {
    this.neighborhoodsTitle = 'Barrios';
    this.editNeighborhoodsExcelTitle = 'Barrios Excel';
    this.neighborhoodsIcon = 'neighborhoods-icon.png';
    this.editNeighborhoodIcon = 'neighborhood-edit-icon.png';
    this.editNeighborhoodsExcelIcon = 'excel-icon.png';
    this.animationState = 0;
  }

  ngOnInit() {}

  ngOnDestroy(): void {}

  onActivate($event: any) {
    this.animationState = this.route?.firstChild?.snapshot.data['routeIdx'];
  }
}
