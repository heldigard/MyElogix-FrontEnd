import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserExcelComponent } from './user-excel.component';

describe('CityExcelComponent', () => {
  let component: UserExcelComponent;
  let fixture: ComponentFixture<UserExcelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserExcelComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(UserExcelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
