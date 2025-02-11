import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BillingOrdersComponent } from './billing-orders.component';

describe('BillingOrdersComponent', () => {
  let component: BillingOrdersComponent;
  let fixture: ComponentFixture<BillingOrdersComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
    imports: [BillingOrdersComponent]
});
    fixture = TestBed.createComponent(BillingOrdersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
