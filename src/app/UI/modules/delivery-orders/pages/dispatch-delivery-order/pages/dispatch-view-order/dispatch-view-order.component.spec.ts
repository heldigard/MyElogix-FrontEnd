import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DispatchViewOrderComponent } from './dispatch-view-order.component';

describe('DispatchViewOrderComponent', () => {
  let component: DispatchViewOrderComponent;
  let fixture: ComponentFixture<DispatchViewOrderComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
    imports: [DispatchViewOrderComponent],
});
    fixture = TestBed.createComponent(DispatchViewOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
