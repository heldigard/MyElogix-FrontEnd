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
  URL_ADMIN_PRODUCTS_EDIT,
  URL_ADMIN_PRODUCTS_EXCEL,
  URL_ADMIN_PRODUCTS_MAIN,
} from '@globals';
import { BreadcrumbComponent, BreadcrumbItemDirective } from 'xng-breadcrumb';
import { slideInAnimation } from '../../../../shared/animation';
import { PestaniaLabelComponent } from '../../../../shared/components/pestania-label/pestania-label.component';
@Component({
  selector: 'app-product-administration',
  imports: [
    BreadcrumbComponent,
    BreadcrumbItemDirective,
    MatIcon,
    MatTabLink,
    RouterLink,
    RouterLinkActive,
    NgClass,
    PestaniaLabelComponent,
    MatTabNavPanel,
    RouterOutlet,
    TitleCasePipe,
    MatTabNav,
  ],
  templateUrl: './product-administration.component.html',
  styleUrl: './product-administration.component.scss',
  animations: [slideInAnimation],
})
export class ProductAdministrationComponent implements OnInit, OnDestroy {
  public productsTitle!: string;
  public editProductTitle!: string;
  public editProductsExcelTitle!: string;
  public productsIcon!: string;
  public editProductIcon!: string;
  public editProductsExcelIcon!: string;

  public animationState: number;

  @ViewChild(MatTabNav, { static: true }) navigation!: MatTabNav;

  private route: ActivatedRoute = inject(ActivatedRoute);

  protected readonly URL_ADMIN_PRODUCTS_MAIN = URL_ADMIN_PRODUCTS_MAIN;
  protected readonly URL_ADMIN_PRODUCTS_EDIT = URL_ADMIN_PRODUCTS_EDIT;
  protected readonly URL_ADMIN_PRODUCTS_EXCEL = URL_ADMIN_PRODUCTS_EXCEL;

  constructor() {
    this.productsTitle = 'Productos';
    this.editProductTitle = 'Editar Producto';
    this.editProductsExcelTitle = 'Excel Productos';
    this.productsIcon = 'products-icon.png';
    this.editProductIcon = 'product-edit-icon.png';
    this.editProductsExcelIcon = 'excel-icon.png';
    this.animationState = 0;
  }

  ngOnInit() {}

  ngOnDestroy(): void {}

  onActivate($event: any) {
    this.animationState = this.route?.firstChild?.snapshot.data['routeIdx'];
  }
}
