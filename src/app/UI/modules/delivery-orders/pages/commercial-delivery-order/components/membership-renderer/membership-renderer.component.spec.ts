import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MembershipRendererComponent } from './membership-renderer.component';

describe('MembershipRendererComponent', () => {
  let component: MembershipRendererComponent;
  let fixture: ComponentFixture<MembershipRendererComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
    imports: [MembershipRendererComponent]
});
    fixture = TestBed.createComponent(MembershipRendererComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
