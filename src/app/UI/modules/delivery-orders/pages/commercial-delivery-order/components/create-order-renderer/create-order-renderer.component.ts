import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';
import { CustomerBasic } from '../../../../../../../customers/domain/models/CustomerBasic';

@Component({
  selector: 'app-create-order-renderer',
  templateUrl: './create-order-renderer.component.html',
  styleUrls: ['./create-order-renderer.component.scss'],
  imports: [MatTooltipModule, MatIconModule],
})
export class CreateOrderRendererComponent implements ICellRendererAngularComp {
  public customerBasic!: CustomerBasic;
  protected params!: ICellRendererParams;

  // gets called once before the renderer is used
  agInit(params: ICellRendererParams): void {
    this.params = params;
    this.customerBasic = params.data;
  }

  // gets called whenever the user gets the cell to refresh
  refresh(params: ICellRendererParams) {
    this.agInit(params);
    return true;
  }

  buttonClicked() {
    const id = this.customerBasic.id;
    this.params.context.componentParent.createNewOrderFromCustomer(id);
  }
}
