import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DispatchOrdersComponent } from './dispatch-orders.component';

describe('DispatchOrdersComponent', () => {
  let component: DispatchOrdersComponent;
  let fixture: ComponentFixture<DispatchOrdersComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
    imports: [DispatchOrdersComponent],
});
    fixture = TestBed.createComponent(DispatchOrdersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
