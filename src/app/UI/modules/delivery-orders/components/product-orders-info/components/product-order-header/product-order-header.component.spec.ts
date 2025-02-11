import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductOrderHeaderComponent } from './product-order-header.component';

describe('ProductOrderHeaderComponent', () => {
  let component: ProductOrderHeaderComponent;
  let fixture: ComponentFixture<ProductOrderHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductOrderHeaderComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductOrderHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
