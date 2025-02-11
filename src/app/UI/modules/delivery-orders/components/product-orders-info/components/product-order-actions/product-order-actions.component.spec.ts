import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductOrderActionsComponent } from './product-order-actions.component';

describe('ProductOrderActionsComponent', () => {
  let component: ProductOrderActionsComponent;
  let fixture: ComponentFixture<ProductOrderActionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductOrderActionsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductOrderActionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
