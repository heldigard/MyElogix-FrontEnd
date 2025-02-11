import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderIdRendererComponent } from './order-id-renderer.component';

describe('OrderIdRendererComponent', () => {
  let component: OrderIdRendererComponent;
  let fixture: ComponentFixture<OrderIdRendererComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrderIdRendererComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrderIdRendererComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
