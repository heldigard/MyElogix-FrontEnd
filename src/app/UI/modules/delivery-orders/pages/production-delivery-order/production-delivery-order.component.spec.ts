import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductionDeliveryOrderComponent } from './production-delivery-order.component';

describe('ProductionDeliveryOrderComponent', () => {
  let component: ProductionDeliveryOrderComponent;
  let fixture: ComponentFixture<ProductionDeliveryOrderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [ProductionDeliveryOrderComponent],
}).compileComponents();

    fixture = TestBed.createComponent(ProductionDeliveryOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
