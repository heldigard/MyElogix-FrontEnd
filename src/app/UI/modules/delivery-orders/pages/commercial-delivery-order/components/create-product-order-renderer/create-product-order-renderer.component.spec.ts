import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateProductOrderRendererComponent } from './create-product-order-renderer.component';

describe('CreateProductOrderRendererComponent', () => {
  let component: CreateProductOrderRendererComponent;
  let fixture: ComponentFixture<CreateProductOrderRendererComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [CreateProductOrderRendererComponent],
}).compileComponents();

    fixture = TestBed.createComponent(CreateProductOrderRendererComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
