import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintBillOrderComponent } from './print-bill-order.component';

describe('PrintBillOrderComponent', () => {
  let component: PrintBillOrderComponent;
  let fixture: ComponentFixture<PrintBillOrderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [PrintBillOrderComponent]
})
    .compileComponents();

    fixture = TestBed.createComponent(PrintBillOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
