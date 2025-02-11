import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderGeneralObservationsComponent } from './order-general-observations.component';

describe('OrderGeneralObservationsComponent', () => {
  let component: OrderGeneralObservationsComponent;
  let fixture: ComponentFixture<OrderGeneralObservationsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
    imports: [OrderGeneralObservationsComponent]
});
    fixture = TestBed.createComponent(OrderGeneralObservationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
