import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeliveryOrdersSearchComponent } from './delivery-orders-search.component';

describe('DeliveryOrdersSearchComponent', () => {
  let component: DeliveryOrdersSearchComponent;
  let fixture: ComponentFixture<DeliveryOrdersSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [DeliveryOrdersSearchComponent]
})
    .compileComponents();

    fixture = TestBed.createComponent(DeliveryOrdersSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
