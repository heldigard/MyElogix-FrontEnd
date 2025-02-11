import { NgClass, NgIf } from '@angular/common';
import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { MatTabNav, MatTabsModule } from '@angular/material/tabs';
import {
  ActivatedRoute,
  Router,
  RouterLink,
  RouterLinkActive,
  RouterOutlet,
} from '@angular/router';
import {
  URL_COMMERCIAL,
  URL_COMMERCIAL_CREATE,
  URL_COMMERCIAL_EDIT,
  URL_COMMERCIAL_MAIN,
  URL_ORDERS,
} from '@globals';
import { MeasureDetailGateway } from '../../../../../delivery-orders/domain/models/gateways/MeasureDetailGateway';
import { MetricUnitGateway } from '../../../../../delivery-orders/domain/models/gateways/MetricUnitGateway';
import { MeasureDetailUseCase } from '../../../../../delivery-orders/domain/usecase/MeasureDetailUseCase';
import { MetricUnitUseCase } from '../../../../../delivery-orders/domain/usecase/MetricUnitUseCase';
import { MeasureDetailGatewayImpl } from '../../../../../delivery-orders/infrastructure/driven_adapters/measure-detail/MeasureDetailGatewayImpl.service';
import { MetricUnitGatewayImpl } from '../../../../../delivery-orders/infrastructure/driven_adapters/metric-unit/MetricUnitGatewayImpl.service';
import { MeasureDetailService } from '../../../../../delivery-orders/infrastructure/services/measure-detail.service';
import { MetricUnitService } from '../../../../../delivery-orders/infrastructure/services/metric-unit.service';
import { slideInAnimation } from '../../../../shared/animation';
import { PestaniaLabelComponent } from '../../../../shared/components/pestania-label/pestania-label.component';

@Component({
  selector: 'app-commercial-delivery-order',
  templateUrl: './commercial-delivery-order.component.html',
  styleUrls: ['./commercial-delivery-order.component.scss'],
  animations: [slideInAnimation],
  standalone: true,
  imports: [
    MatTabsModule,
    RouterLinkActive,
    RouterLink,
    NgClass,
    PestaniaLabelComponent,
    RouterOutlet,
    NgIf,
  ],
  providers: [
    {
      provide: MetricUnitGateway,
      useClass: MetricUnitGatewayImpl,
    },
    {
      provide: MeasureDetailGateway,
      useClass: MeasureDetailGatewayImpl,
    },
    MetricUnitUseCase,
    MetricUnitService,
    MeasureDetailUseCase,
    MeasureDetailService,
  ],
})
export class CommercialDeliveryOrderComponent implements OnInit {
  public createOrderTitle!: string;
  public createOrderIcon!: string;
  public editOrderTitle!: string;
  public editOrderIcon!: string;
  public clientsTitle!: string;
  public clientsIcon!: string;

  public animationState: number;
  @ViewChild(MatTabNav, { static: true }) navigation!: MatTabNav;

  private readonly metricUnitService: MetricUnitService =
    inject(MetricUnitService);
  private readonly measureDetailService: MeasureDetailService =
    inject(MeasureDetailService);

  private readonly router: Router = inject(Router);
  private readonly route: ActivatedRoute = inject(ActivatedRoute);

  protected readonly URL_COMMERCIAL_MAIN = URL_COMMERCIAL_MAIN;
  protected readonly URL_COMMERCIAL_CREATE = URL_COMMERCIAL_CREATE;
  protected readonly URL_COMMERCIAL_EDIT = URL_COMMERCIAL_EDIT;

  constructor() {
    this.clientsTitle = 'Clientes';
    this.clientsIcon = 'clients-icon.png';
    this.createOrderTitle = 'Crear Orden';
    this.createOrderIcon = 'create-delivery-order-icon.png';
    this.editOrderTitle = 'Editar Orden';
    this.editOrderIcon = 'edit-delivery-order-icon.png';
    this.animationState = 0;
  }

  ngOnInit(): void {
    if (this.metricUnitService.items().length === 0) {
      this.metricUnitService.fetchAllData();
    }
    if (this.metricUnitService.items().length === 0) {
      this.measureDetailService.fetchAllData();
    }
  }

  onActivate($event: any) {
    this.animationState = this.route?.firstChild?.snapshot.data['routeIdx'];
  }

  onClickMain() {
    this.router.navigate([URL_ORDERS, URL_COMMERCIAL, URL_COMMERCIAL_MAIN], {
      relativeTo: this.route.root,
    });
  }
}
