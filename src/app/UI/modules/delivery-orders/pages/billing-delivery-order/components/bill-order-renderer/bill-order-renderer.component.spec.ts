import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BillOrderRendererComponent } from './bill-order-renderer.component';

describe('CreateOrderRendererComponent', () => {
  let component: BillOrderRendererComponent;
  let fixture: ComponentFixture<BillOrderRendererComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [BillOrderRendererComponent],
}).compileComponents();

    fixture = TestBed.createComponent(BillOrderRendererComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
