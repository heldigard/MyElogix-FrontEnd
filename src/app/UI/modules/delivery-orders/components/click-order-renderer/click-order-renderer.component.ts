import { Component, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ActivatedRoute } from '@angular/router';
import {
  SCREEN_TYPE_EDIT,
  SCREEN_TYPE_VIEW_DISPATCH,
  SCREEN_TYPE_VIEW_PRODUCTION,
  URL_COMMERCIAL_MAIN,
  URL_DISPATCH_MAIN,
  URL_PRODUCTION_MAIN,
} from '@globals';
import { isEditableStatus } from '@shared';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';
import { Subscription } from 'rxjs';
import { Status } from '../../../../../delivery-orders/domain/models/Status';
import { DeliveryOrderBasic } from '../../../../../delivery_order/domain/model/DeliveryOrderBasic';
import { DeliveryOrderService } from '../../../../../delivery_order/infrastructure/delivery-order/delivery-order.service';

@Component({
  selector: 'app-create-order-renderer',
  templateUrl: './click-order-renderer.component.html',
  styleUrls: ['./click-order-renderer.component.scss'],
  imports: [MatTooltipModule, MatIconModule],
})
export class ClickOrderRendererComponent implements ICellRendererAngularComp {
  public deliveryOrderBasic!: DeliveryOrderBasic;
  public cellValue: string | undefined;
  public routerLink: string;
  public isEditable: boolean = false;

  private readonly orderService: DeliveryOrderService =
    inject(DeliveryOrderService);
  private readonly route: ActivatedRoute = inject(ActivatedRoute);
  private ROUTESubscription$: Subscription | undefined;

  constructor() {
    this.deliveryOrderBasic = this.orderService.getBlankOrderBasic();
    this.routerLink = '';
  }

  ngOnInit() {
    this.ROUTESubscription$ = this.route.url.subscribe((segments) => {
      this.routerLink = segments.map((segment) => segment.path).join('/');
    });
  }

  ngOnDestroy() {
    this.ROUTESubscription$?.unsubscribe();
  }

  // gets called once before the renderer is used
  agInit(params: ICellRendererParams): void {
    this.ngOnInit();
    this.deliveryOrderBasic = params.data;
    this.cellValue = this.getValueToDisplay(params);
    this.setIsDisable(this.deliveryOrderBasic.status);
  }

  // gets called whenever the user gets the cell to refresh
  refresh(params: ICellRendererParams) {
    this.deliveryOrderBasic = params.data;
    this.setIsDisable(this.deliveryOrderBasic.status);
    return true;
  }

  agDispose() {
    this.ngOnDestroy();
  }

  getValueToDisplay(params: ICellRendererParams) {
    return params.valueFormatted ? params.valueFormatted : params.value;
  }

  buttonClicked() {
    this.setActiveDeliveryOrderView();
  }

  setActiveDeliveryOrderView() {
    let type: string = '';
    switch (this.routerLink) {
      case URL_COMMERCIAL_MAIN:
        type = SCREEN_TYPE_EDIT;
        break;
      case URL_PRODUCTION_MAIN:
        type = SCREEN_TYPE_VIEW_PRODUCTION;
        break;
      case URL_DISPATCH_MAIN:
        type = SCREEN_TYPE_VIEW_DISPATCH;
        break;
      default:
        break;
    }

    this.orderService.setActiveDeliveryOrderView(
      this.deliveryOrderBasic.id!,
      type,
    );
  }

  private setIsDisable(status: Status | undefined) {
    if (isEditableStatus(status) && this.routerLink === URL_COMMERCIAL_MAIN) {
      this.isEditable = true;
    } else {
      this.isEditable = false;
    }
  }

  // TODO: implementar el signal de currentDeliveryOrderBasic
}
