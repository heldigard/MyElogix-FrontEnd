import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DispatchDeliveryOrderComponent } from './dispatch-delivery-order.component';

describe('DispatchDeliveryOrderComponent', () => {
  let component: DispatchDeliveryOrderComponent;
  let fixture: ComponentFixture<DispatchDeliveryOrderComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
    imports: [DispatchDeliveryOrderComponent],
});
    fixture = TestBed.createComponent(DispatchDeliveryOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
