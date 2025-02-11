import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClickEditProductRendererComponent } from './click-edit-product-renderer.component';

describe('ClickCreateOrderRendererComponent', () => {
  let component: ClickEditProductRendererComponent;
  let fixture: ComponentFixture<ClickEditProductRendererComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ClickEditProductRendererComponent],
    });
    fixture = TestBed.createComponent(ClickEditProductRendererComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
