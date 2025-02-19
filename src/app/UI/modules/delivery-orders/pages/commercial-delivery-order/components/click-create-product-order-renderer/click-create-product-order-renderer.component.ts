import { Component } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';
import { Product } from '../../../../../../../delivery-orders/domain/models/Product';

@Component({
  selector: 'app-click-create-product-order-renderer',
  templateUrl: './click-create-product-order-renderer.component.html',
  styleUrls: ['./click-create-product-order-renderer.component.scss'],
  standalone: true,
})
export class ClickCreateProductOrderRendererComponent
  implements ICellRendererAngularComp
{
  public product!: Product;
  public cellValue!: string;
  protected params!: ICellRendererParams;

  agInit(params: ICellRendererParams): void {
    this.params = params;
    this.product = params.data;
    this.cellValue = this.getValueToDisplay(params);
  }

  // gets called whenever the user gets the cell to refresh
  refresh(params: ICellRendererParams) {
    this.agInit(params);
    return true;
  }

  getValueToDisplay(params: ICellRendererParams) {
    return params.valueFormatted ? params.valueFormatted : params.value;
  }

  buttonClicked() {
    const productoRef = this.product.reference;
    // Llamar al método addProductByReference del componente padre
    this.params.context.componentParent.addProduct(productoRef);
  }
}
