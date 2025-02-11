import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeliveryZoneListCellRendererComponent } from './delivery-zone-list-cell-renderer.component';

describe('NeighborhoodListCellRendererComponent', () => {
  let component: DeliveryZoneListCellRendererComponent;
  let fixture: ComponentFixture<DeliveryZoneListCellRendererComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeliveryZoneListCellRendererComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DeliveryZoneListCellRendererComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
