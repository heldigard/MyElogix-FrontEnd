import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductOrderFieldsComponent } from './product-order-fields.component';

describe('ProductOrderFieldsComponent', () => {
  let component: ProductOrderFieldsComponent;
  let fixture: ComponentFixture<ProductOrderFieldsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductOrderFieldsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductOrderFieldsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
