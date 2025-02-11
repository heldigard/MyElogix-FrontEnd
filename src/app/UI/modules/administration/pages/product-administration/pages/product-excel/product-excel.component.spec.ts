import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductExcelComponent } from './product-excel.component';

describe('CityExcelComponent', () => {
  let component: ProductExcelComponent;
  let fixture: ComponentFixture<ProductExcelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductExcelComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductExcelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
