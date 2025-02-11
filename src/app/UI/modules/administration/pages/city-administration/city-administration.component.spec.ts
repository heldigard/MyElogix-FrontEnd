import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CityAdministrationComponent } from './city-administration.component';

describe('CityAdministrationComponent', () => {
  let component: CityAdministrationComponent;
  let fixture: ComponentFixture<CityAdministrationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CityAdministrationComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CityAdministrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
