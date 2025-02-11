import { NgFor, NgIf, NgOptimizedImage } from '@angular/common';
import {
  Component,
  EventEmitter,
  inject,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import jsPDF from 'jspdf';
import { Printd } from 'printd';
import { Subscription } from 'rxjs';
import { DeliveryOrder } from '../../../../../delivery_order/domain/model/DeliveryOrder';
import { DeliveryOrderService } from '../../../../../delivery_order/infrastructure/delivery-order/delivery-order.service';
import { ProductOrder } from '../../../../../product-order/domain/model/ProductOrder';
import { UserDTO } from '../../../../../shared/domain/models/auth/UserDTO';
import { AuthenticationImplService } from '../../../../../shared/infrastructure/auth/authentication-impl.service';
import { getDateAsString } from '../../../../shared';
import { SliceTextPipe } from '../../../../shared/pipes/slice-text.pipe';
import { UtcToLocalTimePipe } from '../../../../shared/pipes/utc-to-local-time.pipe';
import { PdfGeneratorService } from '../../../../shared/services/pdf-generator.service';

@Component({
  selector: 'app-print-bill-order',
  templateUrl: './print-bill-order.component.html',
  styleUrls: ['./print-bill-order.component.scss'],
  imports: [
    MatButtonModule,
    MatTooltipModule,
    NgOptimizedImage,
    NgIf,
    NgFor,
    UtcToLocalTimePipe,
    SliceTextPipe,
  ],
})
export class PrintBillOrderComponent {
  @Input() public order?: DeliveryOrder;
  @Input() public orders: DeliveryOrder[] = [];

  @Output() printEvent = new EventEmitter<boolean>();

  public readonly orderService: DeliveryOrderService =
    inject(DeliveryOrderService);
  private readonly authImplService: AuthenticationImplService = inject(
    AuthenticationImplService,
  );
  private readonly pdfGeneratorService: PdfGeneratorService =
    inject(PdfGeneratorService);

  public currentUser = this.authImplService.getCurrentUser();
  public get normalizedOrders(): DeliveryOrder[] {
    if (this.order) {
      return [this.order];
    }
    return this.orders;
  }

  public getValueCustomerName(deliveryOrder: DeliveryOrder): string {
    return deliveryOrder.customer?.name?.toString() ?? '-';
  }

  public getValueCustomerPhone(deliveryOrder: DeliveryOrder): string {
    return deliveryOrder.customer?.phone?.toString() ?? '-';
  }

  public getValueAddress(deliveryOrder: DeliveryOrder): string {
    return deliveryOrder.branchOffice?.address?.toString() ?? '-';
  }

  public getValueCityName(deliveryOrder: DeliveryOrder): string {
    return deliveryOrder.branchOffice?.city?.name?.toString() ?? '-';
  }

  public getValueNeighborhoodName(deliveryOrder: DeliveryOrder): string {
    return deliveryOrder.branchOffice?.neighborhood?.name?.toString() ?? '-';
  }

  public getValueDeliveryZoneName(deliveryOrder: DeliveryOrder): string {
    return deliveryOrder.deliveryZone?.name?.toString() ?? '-';
  }

  public getValueAmount(productOrder: ProductOrder): string {
    return productOrder.amount?.toString() ?? '-';
  }

  public getValueMeasure1(productOrder: ProductOrder): string {
    return productOrder.measure1
      ? productOrder.measure1.toLocaleString('es-CO')
      : '-';
  }

  public getValueMeasure2(productOrder: ProductOrder): string {
    return productOrder.measure2
      ? productOrder.measure2.toLocaleString('es-CO')
      : '-';
  }

  public getValueMetricUnit(productOrder: ProductOrder): string {
    return productOrder.metricUnit?.name?.toString() ?? '-';
  }

  public getValueMeasureDetail(productOrder: ProductOrder): string {
    return productOrder.measureDetail?.name?.toString() ?? '-';
  }

  public getValueFecha(productOrder: ProductOrder): string {
    if (productOrder.finishedAt) {
      return getDateAsString(productOrder.finishedAt);
    } else if (productOrder.createdAt) {
      return getDateAsString(productOrder.createdAt);
    }
    return '-';
  }

  /////////////////////////////////////////////////////

  // Nuevo método async que utiliza PdfGeneratorService
  async generatePDF(divRef: HTMLElement) {
    try {
      const doc = await this.pdfGeneratorService.generatePDF(divRef);
      this.downloadPDF(doc);
    } catch (err) {
      console.error(err);
      // Aquí podrías mostrar una notificación al usuario
    }
  }

  private downloadPDF(doc: jsPDF) {
    doc.save('postres.pdf');
  }

  public printOrders(divRef: HTMLElement) {
    let printd = new Printd();
    printd.print(divRef, [
      this.pdfGeneratorService.bootstrapCssUrl,
      this.pdfGeneratorService.cssText,
    ]);
    this.printEvent.emit(true);
  }
}
