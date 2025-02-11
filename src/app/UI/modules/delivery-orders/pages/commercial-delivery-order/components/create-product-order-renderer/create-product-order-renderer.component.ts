import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';
import { Product } from '../../../../../../../delivery-orders/domain/models/Product';

@Component({
  selector: 'app-create-order-renderer',
  templateUrl: './create-product-order-renderer.component.html',
  styleUrls: ['./create-product-order-renderer.component.scss'],
  imports: [MatTooltipModule, MatIconModule],
})
export class CreateProductOrderRendererComponent
  implements ICellRendererAngularComp
{
  public product!: Product;
  protected params!: ICellRendererParams;

  // gets called once before the renderer is used
  agInit(params: ICellRendererParams): void {
    this.params = params;
    this.product = params.data;
  }

  // gets called whenever the user gets the cell to refresh
  refresh(params: ICellRendererParams) {
    this.agInit(params);
    return true;
  }

  buttonClicked() {
    const productoRef = this.product.reference;
    // Llamar al método addProductByReference del componente padre
    this.params.context.componentParent.addProductByReference(productoRef);
  }
}
