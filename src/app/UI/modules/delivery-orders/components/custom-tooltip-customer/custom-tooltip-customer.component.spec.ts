import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomTooltipCustomerComponent } from './custom-tooltip-customer.component';

describe('CustomtooltipcustomerComponent', () => {
  let component: CustomTooltipCustomerComponent;
  let fixture: ComponentFixture<CustomTooltipCustomerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
    imports: [CustomTooltipCustomerComponent],
});
    fixture = TestBed.createComponent(CustomTooltipCustomerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
