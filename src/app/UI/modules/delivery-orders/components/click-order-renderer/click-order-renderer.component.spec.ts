import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClickOrderRendererComponent } from './click-order-renderer.component';

describe('CreateOrderRendererComponent', () => {
  let component: ClickOrderRendererComponent;
  let fixture: ComponentFixture<ClickOrderRendererComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClickOrderRendererComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ClickOrderRendererComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
