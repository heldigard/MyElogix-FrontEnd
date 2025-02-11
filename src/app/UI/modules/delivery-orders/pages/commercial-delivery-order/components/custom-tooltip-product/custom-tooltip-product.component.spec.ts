import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomTooltipProductComponent } from './custom-tooltip-product.component';

describe('CustomTooltipProductComponent', () => {
  let component: CustomTooltipProductComponent;
  let fixture: ComponentFixture<CustomTooltipProductComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomTooltipProductComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CustomTooltipProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
