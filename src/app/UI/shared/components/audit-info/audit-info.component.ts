import { NgIf } from '@angular/common';
import { Component, Input } from '@angular/core';
import { UserBasic } from '../../../../users/domain/models/UserBasic';
import { UtcToLocalTimePipe } from '../../pipes/utc-to-local-time.pipe';
import { AuditData } from '../audit-data';

@Component({
  selector: 'app-audit-info',
  imports: [NgIf, UtcToLocalTimePipe],
  templateUrl: './audit-info.component.html',
  styleUrl: './audit-info.component.scss',
})
export class AuditInfoComponent {
  @Input() data?: AuditData;
  @Input() showDates: boolean = true;
  @Input() showUpdatedInfo: boolean = false;
  @Input() index?: number; // Optional input for index

  getNameUserBy(user: UserBasic | undefined): string {
    if (user) {
      return `${user.firstName} ${user.lastName} (${user.username}) `;
    }
    return '';
  }

  getDateString(date: Date | undefined): string {
    return date?.toString() ?? '';
  }

  getAccordionId(suffix: string): string {
    return this.index !== undefined ? `${suffix}${this.index}` : suffix;
  }

  isShowAuditInfo(): boolean {
    if (!this.data) return false;

    if (
      'productOrders' in this.data &&
      Array.isArray(this.data.productOrders)
    ) {
      // Case: DeliveryOrder
      return this.data.productOrders.length > 0;
    } else if ('id' in this.data) {
      // Case: ProductOrder
      return (this.data.id ?? -1) >= 0;
    }

    return false;
  }
}
