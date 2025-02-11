import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoleListCellRendererComponent } from './role-list-cell-renderer.component';

describe('NeighborhoodListCellRendererComponent', () => {
  let component: RoleListCellRendererComponent;
  let fixture: ComponentFixture<RoleListCellRendererComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RoleListCellRendererComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(RoleListCellRendererComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
