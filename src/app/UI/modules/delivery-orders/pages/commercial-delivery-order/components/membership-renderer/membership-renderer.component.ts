import { NgClass, NgIf, NgOptimizedImage } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ICellRendererParams } from 'ag-grid-community';
import { CustomerBasic } from '../../../../../../../customers/domain/models/CustomerBasic';
import { EMembership } from '../../../../../../../customers/domain/models/EMembership';
import { Membership } from '../../../../../../../customers/domain/models/Membership';
import { CustomerService } from '../../../../../../../customers/infrastructure/services/customer.service';

@Component({
  selector: 'app-membership-renderer',
  templateUrl: './membership-renderer.component.html',
  styleUrls: ['./membership-renderer.component.scss'],
  imports: [NgIf, NgOptimizedImage, NgClass, MatTooltipModule],
})
export class MembershipRendererComponent {
  public params!: ICellRendererParams;
  public imgForValue: string;
  public iconClass: string;
  public tooltip: string;
  private customer: CustomerBasic;

  private readonly customerService: CustomerService = inject(CustomerService);

  constructor() {
    this.imgForValue = '';
    this.iconClass = '';
    this.tooltip = '';
    this.customer = this.customerService.getBlank();
  }

  // gets called once before the renderer is used
  agInit(params: ICellRendererParams): void {
    this.params = params;
    this.customer = params.data;
    if (this.customer.membership) this.setIcon(this.customer.membership);
  }

  // gets called whenever the user gets the cell to refresh
  refresh(params: ICellRendererParams) {
    // set value into cell again
    this.params = params;
    this.customer = params.data;
    this.setIcon(params.data);
    return true;
  }

  private setIcon(membership: Membership) {
    if (!membership?.name) return;

    switch (membership.name) {
      case EMembership.GOLD:
        this.imgForValue = 'assets/icons/gold-icon.png';
        this.iconClass = 'img-view';
        break;
      case EMembership.SILVER:
        this.imgForValue = 'assets/icons/silver-icon.png';
        this.iconClass = 'img-view';
        break;
      case EMembership.BRONZE:
        this.imgForValue = 'assets/icons/bronze-icon.png';
        this.iconClass = 'img-view';
        break;
    }
    this.tooltip = membership.name;
  }
}
