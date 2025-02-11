import { Component } from '@angular/core';
import { ITooltipParams } from 'ag-grid-community';
import { ITooltipAngularComp } from 'ag-grid-angular';
import { UserBasic } from '../../../../../users/domain/models/UserBasic';
import { MatCardModule } from '@angular/material/card';
@Component({
    selector: 'app-custom-tooltip-by-user',
    templateUrl: './custom-tooltip-by-user.component.html',
    styleUrls: ['./custom-tooltip-by-user.component.scss'],
    imports: [MatCardModule]
})
export class CustomTooltipByUserComponent implements ITooltipAngularComp {
  private params!: ITooltipParams;
  public data!: any;
  public color!: string;
  public user: UserBasic | undefined | null;

  agInit(params: ITooltipParams): void {
    this.params = params;
    this.user = params.value as UserBasic;
    // this.color = this.params.color || 'white';
  }

  // gets called whenever the cell refreshes
  refresh(params: ITooltipParams) {
    this.params = params;
    this.user = params.value as UserBasic;
    // As we have updated the params we return true to let AG Grid know we have handled the refresh.
    // So AG Grid will not recreate the cell renderer from scratch.
    return true;
  }
}
