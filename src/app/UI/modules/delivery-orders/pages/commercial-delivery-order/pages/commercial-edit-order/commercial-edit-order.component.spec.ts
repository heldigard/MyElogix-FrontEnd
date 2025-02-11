import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommercialEditOrderComponent } from './commercial-edit-order.component';

describe('CommercialEditOrderComponent', () => {
  let component: CommercialEditOrderComponent;
  let fixture: ComponentFixture<CommercialEditOrderComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
    imports: [CommercialEditOrderComponent]
});
    fixture = TestBed.createComponent(CommercialEditOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
