import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommercialCustomersComponent } from './commercial-customers.component';

describe('CommercialCustomersComponent', () => {
  let component: CommercialCustomersComponent;
  let fixture: ComponentFixture<CommercialCustomersComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
    imports: [CommercialCustomersComponent]
});
    fixture = TestBed.createComponent(CommercialCustomersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
