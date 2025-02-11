import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateEditOrderComponent } from './create-edit-order.component';

describe('CreateEditOrderComponent', () => {
  let component: CreateEditOrderComponent;
  let fixture: ComponentFixture<CreateEditOrderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateEditOrderComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CreateEditOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
