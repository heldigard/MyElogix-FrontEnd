import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClickCreateProductOrderRendererComponent } from './click-create-product-order-renderer.component';

describe('ClickCreateProductOrderRendererComponent', () => {
  let component: ClickCreateProductOrderRendererComponent;
  let fixture: ComponentFixture<ClickCreateProductOrderRendererComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
    imports: [ClickCreateProductOrderRendererComponent]
});
    fixture = TestBed.createComponent(ClickCreateProductOrderRendererComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
