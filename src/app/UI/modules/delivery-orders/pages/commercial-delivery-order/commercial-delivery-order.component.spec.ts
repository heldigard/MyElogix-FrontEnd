import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommercialDeliveryOrderComponent } from './commercial-delivery-order.component';

describe('ComercialDeliveryOrderComponent', () => {
  let component: CommercialDeliveryOrderComponent;
  let fixture: ComponentFixture<CommercialDeliveryOrderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [CommercialDeliveryOrderComponent],
}).compileComponents();

    fixture = TestBed.createComponent(CommercialDeliveryOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
