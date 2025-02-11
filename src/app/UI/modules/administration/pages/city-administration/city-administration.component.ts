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
import { URL_ADMIN_CITIES_EXCEL, URL_ADMIN_CITIES_MAIN } from '@globals';
import { BreadcrumbComponent, BreadcrumbItemDirective } from 'xng-breadcrumb';
import { slideInAnimation } from '../../../../shared/animation';
import { PestaniaLabelComponent } from '../../../../shared/components/pestania-label/pestania-label.component';

@Component({
  selector: 'app-city-administration',
  imports: [
    BreadcrumbComponent,
    BreadcrumbItemDirective,
    MatIcon,
    MatTabLink,
    TitleCasePipe,
    MatTabNav,
    RouterLink,
    RouterLinkActive,
    NgClass,
    PestaniaLabelComponent,
    MatTabNavPanel,
    RouterOutlet,
  ],
  templateUrl: './city-administration.component.html',
  styleUrl: './city-administration.component.scss',
  animations: [slideInAnimation],
})
export class CityAdministrationComponent implements OnInit, OnDestroy {
  public citiesTitle!: string;
  public editCitiesExcelTitle!: string;
  public citiesIcon!: string;
  public editCityIcon!: string;
  public editCitiesExcelIcon!: string;

  public animationState: number;

  @ViewChild(MatTabNav, { static: true }) navigation!: MatTabNav;

  private route: ActivatedRoute = inject(ActivatedRoute);

  protected readonly URL_ADMIN_CITIES_MAIN = URL_ADMIN_CITIES_MAIN;
  protected readonly URL_ADMIN_CITIES_EXCEL = URL_ADMIN_CITIES_EXCEL;

  constructor() {
    this.citiesTitle = 'Ciudades';
    this.editCitiesExcelTitle = 'Ciudades Excel';
    this.citiesIcon = 'cities-icon.png';
    this.editCityIcon = 'cities-edit-icon.png';
    this.editCitiesExcelIcon = 'excel-icon.png';
    this.animationState = 0;
  }

  ngOnInit() {}

  ngOnDestroy(): void {}

  onActivate($event: any) {
    this.animationState = this.route?.firstChild?.snapshot.data['routeIdx'];
  }
}
