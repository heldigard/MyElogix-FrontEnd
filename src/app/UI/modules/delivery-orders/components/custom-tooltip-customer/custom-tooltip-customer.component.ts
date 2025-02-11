import { Component } from '@angular/core';
import { ITooltipParams } from 'ag-grid-community';
import { ITooltipAngularComp } from 'ag-grid-angular';
import { CustomerBasic } from '../../../../../customers/domain/models/CustomerBasic';
import { MatCardModule } from '@angular/material/card';

@Component({
    selector: 'app-custom-tooltip-customer',
    templateUrl: './custom-tooltip-customer.component.html',
    styleUrls: ['./custom-tooltip-customer.component.scss'],
    imports: [MatCardModule]
})
export class CustomTooltipCustomerComponent implements ITooltipAngularComp {
  private params!: ITooltipParams;
  public data!: any;
  public color!: string;
  public customer: CustomerBasic | undefined | null;

  agInit(params: ITooltipParams): void {
    this.params = params;
    this.customer = params.data.customer as CustomerBasic;
    // this.color = this.params.color || 'white';
  }

  // gets called whenever the cell refreshes
  refresh(params: ITooltipParams) {
    this.params = params;
    this.customer = params.data.customer as CustomerBasic;
    // As we have updated the params we return true to let AG Grid know we have handled the refresh.
    // So AG Grid will not recreate the cell renderer from scratch.
    return true;
  }
}
