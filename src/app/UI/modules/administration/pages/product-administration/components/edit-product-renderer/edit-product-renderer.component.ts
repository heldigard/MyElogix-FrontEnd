import { Component, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
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
  selector: 'app-create-order-renderer',
  templateUrl: './edit-product-renderer.component.html',
  styleUrls: ['./edit-product-renderer.component.scss'],
  imports: [MatTooltipModule, MatIconModule],
})
export class EditProductRendererComponent implements ICellRendererAngularComp {
  public product!: Product;

  private readonly productService: ProductService = inject(ProductService);
  private readonly router: Router = inject(Router);
  private readonly route: ActivatedRoute = inject(ActivatedRoute);

  constructor() {
    this.product = this.productService.getBlank();
  }

  // gets called once before the renderer is used
  agInit(params: ICellRendererParams): void {
    this.product = params.data;
  }

  // gets called whenever the user gets the cell to refresh
  refresh(params: ICellRendererParams) {
    // set value into cell again
    this.product = params.data;
    return true;
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
