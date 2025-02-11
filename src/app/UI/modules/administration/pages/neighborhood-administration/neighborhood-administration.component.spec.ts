import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NeighborhoodAdministrationComponent } from './neighborhood-administration.component';

describe('NeighborhoodAdministrationComponent', () => {
  let component: NeighborhoodAdministrationComponent;
  let fixture: ComponentFixture<NeighborhoodAdministrationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NeighborhoodAdministrationComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NeighborhoodAdministrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
