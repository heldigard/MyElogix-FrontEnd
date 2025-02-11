import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditCustomerRendererComponent } from './edit-customer-renderer.component';

describe('CreateOrderRendererComponent', () => {
  let component: EditCustomerRendererComponent;
  let fixture: ComponentFixture<EditCustomerRendererComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditCustomerRendererComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(EditCustomerRendererComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
