import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClickCreateOrderRendererComponent } from './click-create-order-renderer.component';

describe('ClickCreateOrderRendererComponent', () => {
  let component: ClickCreateOrderRendererComponent;
  let fixture: ComponentFixture<ClickCreateOrderRendererComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
    imports: [ClickCreateOrderRendererComponent]
});
    fixture = TestBed.createComponent(ClickCreateOrderRendererComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
