import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NeighborhoodEditComponent } from './neighborhood-edit.component';

describe('CityEditComponent', () => {
  let component: NeighborhoodEditComponent;
  let fixture: ComponentFixture<NeighborhoodEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NeighborhoodEditComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(NeighborhoodEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
