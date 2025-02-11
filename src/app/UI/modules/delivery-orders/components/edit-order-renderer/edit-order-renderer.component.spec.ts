import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditOrderRendererComponent } from './edit-order-renderer.component';

describe('CreateOrderRendererComponent', () => {
  let component: EditOrderRendererComponent;
  let fixture: ComponentFixture<EditOrderRendererComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [EditOrderRendererComponent],
}).compileComponents();

    fixture = TestBed.createComponent(EditOrderRendererComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
