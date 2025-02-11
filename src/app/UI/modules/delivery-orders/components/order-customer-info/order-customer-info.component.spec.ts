import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderCustomerInfoComponent } from './order-customer-info.component';

describe('CustomerInfoComponent', () => {
  let component: OrderCustomerInfoComponent;
  let fixture: ComponentFixture<OrderCustomerInfoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
    imports: [OrderCustomerInfoComponent],
});
    fixture = TestBed.createComponent(OrderCustomerInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
