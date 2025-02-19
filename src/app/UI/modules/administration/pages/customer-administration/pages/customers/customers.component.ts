import { Component, OnDestroy, OnInit } from '@angular/core';
import { CustomerSearchComponent } from '../../../../../../shared/components/customer-search/customer-search.component';
import { MODULE_CUSTOMER_ADMIN } from '@globals';

@Component({
  selector: 'app-customers',
  imports: [CustomerSearchComponent],
  templateUrl: './customers.component.html',
  styleUrl: './customers.component.scss',
})
export class CustomersComponent implements OnInit, OnDestroy {
  public clientsTitle!: string;
  public moduleName!: string;

  constructor() {
    this.clientsTitle = 'Clientes';
    this.moduleName = MODULE_CUSTOMER_ADMIN;
  }

  ngOnDestroy(): void {}

  ngOnInit(): void {}
}
