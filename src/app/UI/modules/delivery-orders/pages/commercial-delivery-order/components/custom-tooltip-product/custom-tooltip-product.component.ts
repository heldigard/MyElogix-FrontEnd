import { Component } from '@angular/core';
import { ITooltipParams } from 'ag-grid-community';
import { ITooltipAngularComp } from 'ag-grid-angular';
import { Product } from '../../../../../../../delivery-orders/domain/models/Product';
import { MatCardModule } from '@angular/material/card';
@Component({
    selector: 'app-custom-tooltip-product',
    imports: [MatCardModule],
    templateUrl: './custom-tooltip-product.component.html',
    styleUrl: './custom-tooltip-product.component.scss'
})
export class CustomTooltipProductComponent implements ITooltipAngularComp {
  // private params!: ITooltipParams;
  public data!: any;
  public product: Product | undefined | null;

  agInit(params: ITooltipParams): void {
    // this.params = params;
    this.product = params.data as Product;
  }

  // gets called whenever the cell refreshes
  refresh(params: ITooltipParams) {
    // this.params = params;
    this.product = params.data as Product;
    // As we have updated the params we return true to let AG Grid know we have handled the refresh.
    // So AG Grid will not recreate the cell renderer from scratch.
    return true;
  }
}
