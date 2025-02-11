import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PestaniaLabelComponent } from './pestania-label.component';

describe('PestaniaLabelComponent', () => {
  let component: PestaniaLabelComponent;
  let fixture: ComponentFixture<PestaniaLabelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [PestaniaLabelComponent]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PestaniaLabelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
