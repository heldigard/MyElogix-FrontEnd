import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommercialCreateOrderComponent } from './commercial-create-order.component';

describe('CommercialCreateOrderComponent', () => {
  let component: CommercialCreateOrderComponent;
  let fixture: ComponentFixture<CommercialCreateOrderComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
    imports: [CommercialCreateOrderComponent]
});
    fixture = TestBed.createComponent(CommercialCreateOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
