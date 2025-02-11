import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BillingSummaryComponent } from './billing-summary.component';

describe('BillingSummaryComponent', () => {
  let component: BillingSummaryComponent;
  let fixture: ComponentFixture<BillingSummaryComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
    imports: [BillingSummaryComponent]
});
    fixture = TestBed.createComponent(BillingSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
