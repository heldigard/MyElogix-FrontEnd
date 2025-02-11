import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerExcelComponent } from './customer-excel.component';

describe('CustomersExcelComponent', () => {
  let component: CustomerExcelComponent;
  let fixture: ComponentFixture<CustomerExcelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomerExcelComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CustomerExcelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
