import { Component } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';
import { CustomerBasic } from '../../../../../../../customers/domain/models/CustomerBasic';

@Component({
  selector: 'app-click-create-order-renderer',
  templateUrl: './click-create-order-renderer.component.html',
  styleUrls: ['./click-create-order-renderer.component.scss'],
  standalone: true,
})
export class ClickCreateOrderRendererComponent
  implements ICellRendererAngularComp
{
  public customerBasic!: CustomerBasic;
  protected params!: ICellRendererParams;
  public cellValue!: string;

  agInit(params: ICellRendererParams): void {
    this.params = params;
    this.customerBasic = params.data;
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
    const id = this.customerBasic.id;
    this.params.context.componentParent.createNewOrderFromCustomer(id);
  }
}
