import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditProductRendererComponent } from './edit-product-renderer.component';

describe('CreateOrderRendererComponent', () => {
  let component: EditProductRendererComponent;
  let fixture: ComponentFixture<EditProductRendererComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditProductRendererComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(EditProductRendererComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
