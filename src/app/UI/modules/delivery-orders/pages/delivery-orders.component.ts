import { NgIf, TitleCasePipe } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import {
  MatCard,
  MatCardContent,
  MatCardHeader,
  MatCardTitle,
} from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
import {
  URL_BILLING,
  URL_COMMERCIAL,
  URL_DISPATCH,
  URL_HOME,
  URL_ORDERS,
  URL_PRODUCTION,
} from '@globals';
import { BreadcrumbComponent, BreadcrumbItemDirective } from 'xng-breadcrumb';
import { AuthenticationImplService } from '../../../../shared/infrastructure/auth/authentication-impl.service';
import { slideInAnimation } from '../../../shared/animation'

@Component({
  selector: 'app-delivery-orders',
  templateUrl: './delivery-orders.component.html',
  styleUrls: ['./delivery-orders.component.scss'],
  animations: [slideInAnimation],
  imports: [
    BreadcrumbComponent,
    BreadcrumbItemDirective,
    MatIconModule,
    RouterOutlet,
    TitleCasePipe,
    MatCard,
    MatCardContent,
    MatCardTitle,
    NgIf,
    MatCardHeader,
  ],
})
export class DeliveryOrdersComponent implements OnInit {
  private router: Router = inject(Router);
  private route: ActivatedRoute = inject(ActivatedRoute);

  public authenticationImplService: AuthenticationImplService = inject(
    AuthenticationImplService,
  );

  constructor() {}

  ngOnInit(): void {}

  public goToCommercial(): void {
    this.router.navigate([URL_ORDERS, URL_COMMERCIAL], {
      relativeTo: this.route.root,
    });
  }

  public goToProduction(): void {
    this.router.navigate([URL_ORDERS, URL_PRODUCTION], {
      relativeTo: this.route.root,
    });
  }

  public goToDispatch(): void {
    this.router.navigate([URL_ORDERS, URL_DISPATCH], {
      relativeTo: this.route.root,
    });
  }

  public goToBilling(): void {
    this.router.navigate([URL_ORDERS, URL_BILLING], {
      relativeTo: this.route.root,
    });
  }

  public isDeliveryOrdersMain(): boolean {
    return (
      this.router.url === '/' + URL_ORDERS || this.router.url === '/' + URL_HOME
    );
  }
}
