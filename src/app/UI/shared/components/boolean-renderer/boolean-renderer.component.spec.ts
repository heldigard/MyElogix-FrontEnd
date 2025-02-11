import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BooleanRendererComponent } from './boolean-renderer.component';

describe('CreateOrderRendererComponent', () => {
  let component: BooleanRendererComponent;
  let fixture: ComponentFixture<BooleanRendererComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [BooleanRendererComponent],
}).compileComponents();

    fixture = TestBed.createComponent(BooleanRendererComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
