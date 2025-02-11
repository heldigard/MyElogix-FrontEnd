import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BillingDeliveryOrderComponent } from './billing-delivery-order.component';

describe('BillingDeliveryOrderComponent', () => {
  let component: BillingDeliveryOrderComponent;
  let fixture: ComponentFixture<BillingDeliveryOrderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [BillingDeliveryOrderComponent],
}).compileComponents();

    fixture = TestBed.createComponent(BillingDeliveryOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
