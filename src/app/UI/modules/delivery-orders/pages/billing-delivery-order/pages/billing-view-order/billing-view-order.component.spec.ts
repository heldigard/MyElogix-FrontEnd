import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BillingViewOrderComponent } from './billing-view-order.component';

describe('BillingViewOrderComponent', () => {
  let component: BillingViewOrderComponent;
  let fixture: ComponentFixture<BillingViewOrderComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [BillingViewOrderComponent],
    });
    fixture = TestBed.createComponent(BillingViewOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
