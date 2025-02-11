import { NgClass } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { isEditableStatus } from '@shared';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';
import { Status } from '../../../../../delivery-orders/domain/models/Status';
import { DeliveryOrderBasic } from '../../../../../delivery_order/domain/model/DeliveryOrderBasic';
import { SCREEN_TYPE_EDIT } from '../../../../../globals';

@Component({
  selector: 'app-edit-order-renderer',
  templateUrl: './edit-order-renderer.component.html',
  styleUrls: ['./edit-order-renderer.component.scss'],
  imports: [MatTooltipModule, NgClass, MatIconModule],
})
export class EditOrderRendererComponent implements ICellRendererAngularComp {
  public orderBasic!: DeliveryOrderBasic;
  @Input() public screenType!: string;
  public isEditable: boolean = false;
  public iconName!: string;
  public tooltipName!: string;
  protected params!: ICellRendererParams;

  // gets called once before the renderer is used
  agInit(params: ICellRendererParams): void {
    this.params = params;
    this.orderBasic = params.data;
    this.setIsDisable(this.orderBasic.status);
  }

  // gets called whenever the user gets the cell to refresh
  refresh(params: ICellRendererParams) {
    this.agInit(params);
    return true;
  }

  buttonClicked() {
    const id = this.orderBasic.id;
    this.params.context.componentParent.handleActiveDeliveryOrderView(id);
  }

  private setIsDisable(status: Status | undefined) {
    if (isEditableStatus(status) && this.screenType === SCREEN_TYPE_EDIT) {
      this.isEditable = true;
      this.iconName = 'edit';
      this.tooltipName = 'Editar Orden';
    } else {
      this.isEditable = false;
      this.iconName = 'visibility';
      this.tooltipName = 'Ver Orden';
    }
  }
}
