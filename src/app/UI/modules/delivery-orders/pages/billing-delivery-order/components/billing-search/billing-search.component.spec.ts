import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BillingDeliveryOrdersSearchComponent } from './billing-search.component';

describe('DeliveryOrdersSearchComponent', () => {
  let component: BillingDeliveryOrdersSearchComponent;
  let fixture: ComponentFixture<BillingDeliveryOrdersSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BillingDeliveryOrdersSearchComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(BillingDeliveryOrdersSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
