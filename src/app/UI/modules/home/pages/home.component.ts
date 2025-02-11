import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, Router } from '@angular/router';
import { URL_ADMIN } from '@globals';
import { AuthenticationImplService } from '../../../../shared/infrastructure/auth/authentication-impl.service';
import { AdministrationComponent } from '../../administration/pages/administration.component';
import { DeliveryOrdersComponent } from '../../delivery-orders/pages/delivery-orders.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  imports: [
    MatCardModule,
    MatIconModule,
    DeliveryOrdersComponent,
    AdministrationComponent,
  ],
})
export class HomeComponent implements OnInit, OnDestroy {
  private router: Router = inject(Router);
  private route: ActivatedRoute = inject(ActivatedRoute);

  public authenticationImplService: AuthenticationImplService = inject(
    AuthenticationImplService,
  );

  constructor() {}

  ngOnInit(): void {}

  ngOnDestroy(): void {}

  public goToAdmin(): void {
    this.router.navigate([URL_ADMIN], {
      relativeTo: this.route.root,
    });
  }
}
