import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NeighborhoodListCellRendererComponent } from './neighborhood-list-cell-renderer.component';

describe('NeighborhoodListCellRendererComponent', () => {
  let component: NeighborhoodListCellRendererComponent;
  let fixture: ComponentFixture<NeighborhoodListCellRendererComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NeighborhoodListCellRendererComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(NeighborhoodListCellRendererComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
