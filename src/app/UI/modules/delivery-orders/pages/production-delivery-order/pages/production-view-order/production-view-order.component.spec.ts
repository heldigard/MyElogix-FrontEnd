import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductionViewOrderComponent } from './production-view-order.component';

describe('ProductionViewOrderComponent', () => {
  let component: ProductionViewOrderComponent;
  let fixture: ComponentFixture<ProductionViewOrderComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
    imports: [ProductionViewOrderComponent]
});
    fixture = TestBed.createComponent(ProductionViewOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
