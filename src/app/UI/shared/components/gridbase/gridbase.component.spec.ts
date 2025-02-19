import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GridbaseComponent } from './gridbase.component';

describe('GridbaseComponent', () => {
  let component: GridbaseComponent;
  let fixture: ComponentFixture<GridbaseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GridbaseComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GridbaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
