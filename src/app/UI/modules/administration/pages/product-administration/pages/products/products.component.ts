import { Component, OnDestroy, OnInit } from '@angular/core';
import { ProductSearchComponent } from '../../../../../../shared/components/product-search/product-search.component';
import { MODULE_PRODUCT_ADMIN } from '@globals';

@Component({
    selector: 'app-products',
    imports: [ProductSearchComponent],
    templateUrl: './products.component.html',
    styleUrl: './products.component.scss'
})
export class ProductsComponent implements OnInit, OnDestroy {
  public productsTitle!: string;
  public moduleName!: string;

  constructor() {
    this.productsTitle = 'Productos';
    this.moduleName = MODULE_PRODUCT_ADMIN;
  }

  ngOnDestroy(): void {}

  ngOnInit(): void {}
}
