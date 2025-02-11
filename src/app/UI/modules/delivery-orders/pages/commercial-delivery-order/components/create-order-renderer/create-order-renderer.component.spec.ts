import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateOrderRendererComponent } from './create-order-renderer.component';

describe('CreateOrderRendererComponent', () => {
  let component: CreateOrderRendererComponent;
  let fixture: ComponentFixture<CreateOrderRendererComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [CreateOrderRendererComponent]
})
    .compileComponents();

    fixture = TestBed.createComponent(CreateOrderRendererComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
