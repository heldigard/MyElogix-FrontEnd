import {
  AfterContentInit,
  Directive,
  ElementRef,
  inject,
  Input,
} from '@angular/core';

@Directive({
    selector: '[appAutoFocus]',
    standalone: true,
})
export class AutoFocusDirective implements AfterContentInit {
  @Input() public focus: boolean;

  private el: ElementRef = inject(ElementRef);

  constructor() {
    this.focus = true;
  }

  ngAfterContentInit(): void {
    setTimeout(() => {
      this.el.nativeElement.focus();
    }, 500);
  }
}
