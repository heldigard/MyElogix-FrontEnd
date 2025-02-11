import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClickEditCustomerRendererComponent } from './click-edit-customer-renderer.component';

describe('ClickCreateOrderRendererComponent', () => {
  let component: ClickEditCustomerRendererComponent;
  let fixture: ComponentFixture<ClickEditCustomerRendererComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ClickEditCustomerRendererComponent],
    });
    fixture = TestBed.createComponent(ClickEditCustomerRendererComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
