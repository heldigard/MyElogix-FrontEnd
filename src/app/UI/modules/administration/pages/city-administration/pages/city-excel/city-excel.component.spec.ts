import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CityExcelComponent } from './city-excel.component';

describe('CityExcelComponent', () => {
  let component: CityExcelComponent;
  let fixture: ComponentFixture<CityExcelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CityExcelComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CityExcelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
