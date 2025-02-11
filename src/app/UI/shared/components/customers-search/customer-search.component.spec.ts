import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerSearchComponent } from './customer-search.component';

describe('CustomersSearchComponent', () => {
  let component: CustomerSearchComponent;
  let fixture: ComponentFixture<CustomerSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [CustomerSearchComponent],
}).compileComponents();

    fixture = TestBed.createComponent(CustomerSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
