import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NeighborhoodExcelComponent } from './neighborhood-excel.component';

describe('CityExcelComponent', () => {
  let component: NeighborhoodExcelComponent;
  let fixture: ComponentFixture<NeighborhoodExcelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NeighborhoodExcelComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(NeighborhoodExcelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
