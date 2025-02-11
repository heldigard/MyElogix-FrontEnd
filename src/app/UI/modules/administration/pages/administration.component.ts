import { NgIf } from '@angular/common';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import {
  MatCard,
  MatCardContent,
  MatCardHeader,
  MatCardTitle,
} from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';
import { ActivatedRoute, Router } from '@angular/router';
import {
  URL_ADMIN,
  URL_ADMIN_CITIES,
  URL_ADMIN_CLIENTS,
  URL_ADMIN_NEIGHBORHOODS,
  URL_ADMIN_PRODUCTS,
  URL_ADMIN_USERS,
} from '@globals';
import { AuthenticationImplService } from '../../../../shared/infrastructure/auth/authentication-impl.service';

@Component({
  selector: 'app-administration',
  imports: [
    MatCard,
    MatCardTitle,
    MatCardContent,
    MatIcon,
    NgIf,
    MatCardHeader,
  ],
  templateUrl: './administration.component.html',
  styleUrl: './administration.component.scss',
})
export class AdministrationComponent implements OnInit, OnDestroy {
  private router: Router = inject(Router);
  private route: ActivatedRoute = inject(ActivatedRoute);

  public authenticationImplService: AuthenticationImplService = inject(
    AuthenticationImplService,
  );

  constructor() {}

  ngOnInit(): void {}

  ngOnDestroy(): void {}

  public goToAdminClients(): void {
    this.router.navigate([URL_ADMIN, URL_ADMIN_CLIENTS], {
      relativeTo: this.route.root,
    });
  }

  public goToAdminProducts(): void {
    this.router.navigate([URL_ADMIN, URL_ADMIN_PRODUCTS], {
      relativeTo: this.route.root,
    });
  }

  public goToAdminNeighborhoods(): void {
    this.router.navigate([URL_ADMIN, URL_ADMIN_NEIGHBORHOODS], {
      relativeTo: this.route.root,
    });
  }

  public goToAdminCities(): void {
    this.router.navigate([URL_ADMIN, URL_ADMIN_CITIES], {
      relativeTo: this.route.root,
    });
  }

  public goToAdminUsers(): void {
    this.router.navigate([URL_ADMIN, URL_ADMIN_USERS], {
      relativeTo: this.route.root,
    });
  }
}
