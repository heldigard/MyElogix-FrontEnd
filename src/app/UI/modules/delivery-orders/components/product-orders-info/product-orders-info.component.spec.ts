import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductOrdersInfoComponent } from './product-orders-info.component';

describe('ProductOrdersInfoComponent', () => {
  let component: ProductOrdersInfoComponent;
  let fixture: ComponentFixture<ProductOrdersInfoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
    imports: [ProductOrdersInfoComponent]
});
    fixture = TestBed.createComponent(ProductOrdersInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
