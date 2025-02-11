import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SummaryBillingSearchComponent } from './summary-billing-search.component';

describe('DeliveryOrdersSearchComponent', () => {
  let component: SummaryBillingSearchComponent;
  let fixture: ComponentFixture<SummaryBillingSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SummaryBillingSearchComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SummaryBillingSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
