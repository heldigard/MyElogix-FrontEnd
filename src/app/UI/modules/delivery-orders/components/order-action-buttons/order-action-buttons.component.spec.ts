import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderActionButtonsComponent } from './order-action-buttons.component';

describe('OrderActionButtonsComponent', () => {
  let component: OrderActionButtonsComponent;
  let fixture: ComponentFixture<OrderActionButtonsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
    imports: [OrderActionButtonsComponent]
});
    fixture = TestBed.createComponent(OrderActionButtonsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
