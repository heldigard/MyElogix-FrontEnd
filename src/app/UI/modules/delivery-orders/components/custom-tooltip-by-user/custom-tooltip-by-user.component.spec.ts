import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomTooltipByUserComponent } from './custom-tooltip-by-user.component';

describe('CustomTooltipComponent', () => {
  let component: CustomTooltipByUserComponent;
  let fixture: ComponentFixture<CustomTooltipByUserComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
    imports: [CustomTooltipByUserComponent],
});
    fixture = TestBed.createComponent(CustomTooltipByUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
