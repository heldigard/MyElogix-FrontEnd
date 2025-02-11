import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  URL_ADMIN,
  URL_ADMIN_PRODUCTS,
  URL_ADMIN_PRODUCTS_EDIT,
} from '@globals';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';
import { Product } from '../../../../../../../delivery-orders/domain/models/Product';
import { ProductService } from '../../../../../../../delivery-orders/infrastructure/services/product.service';

@Component({
  selector: 'app-click-create-order-renderer',
  templateUrl: './click-edit-product-renderer.component.html',
  styleUrls: ['./click-edit-product-renderer.component.scss'],
  standalone: true,
})
export class ClickEditProductRendererComponent
  implements ICellRendererAngularComp
{
  public product!: Product;
  public cellValue: string | undefined;

  private readonly productService: ProductService = inject(ProductService);
  private readonly router: Router = inject(Router);
  private readonly route: ActivatedRoute = inject(ActivatedRoute);

  constructor() {
    this.product = this.productService.getBlank();
  }

  agInit(params: ICellRendererParams): void {
    this.product = params.data;
    this.cellValue = this.getValueToDisplay(params);
  }

  // gets called whenever the user gets the cell to refresh
  refresh(params: ICellRendererParams) {
    // set value into cell again
    this.product = params.data;
    return true;
  }

  getValueToDisplay(params: ICellRendererParams) {
    return params.valueFormatted ? params.valueFormatted : params.value;
  }

  buttonClicked() {
    this.sendIdEditProduct();
  }

  sendIdEditProduct() {
    this.productService.setCurrentProductById(this.product.id!);
    this.router.navigate(
      [URL_ADMIN, URL_ADMIN_PRODUCTS, URL_ADMIN_PRODUCTS_EDIT],
      {
        relativeTo: this.route.root,
        queryParams: { productId: this.product.id },
      },
    );
  }
}
