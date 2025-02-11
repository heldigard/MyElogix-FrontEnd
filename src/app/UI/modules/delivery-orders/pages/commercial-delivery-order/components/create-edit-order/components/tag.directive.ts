import {
  ChangeDetectorRef,
  Directive,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  Output,
} from '@angular/core';
import { MatSelect } from '@angular/material/select';

@Directive({
  selector: '[appTag]',
  standalone: true,
})
export class TagDirective {
  @Input() tagIndex!: string;
  @Input() isMeasurable: boolean = true;
  @Output() lastTagReached = new EventEmitter<void>();
  private isSelectOpen = false;

  constructor(
    private readonly el: ElementRef,
    private readonly cdr: ChangeDetectorRef,
  ) {
    if (this.el.nativeElement instanceof MatSelect) {
      this.el.nativeElement.openedChange.subscribe((opened: boolean) => {
        this.isSelectOpen = opened;
      });
    }
  }

  @HostListener('focus')
  onFocus() {
    const matSelect = this.el.nativeElement as MatSelect;
    if (matSelect instanceof MatSelect && !this.isSelectOpen) {
      matSelect.open();
    }
  }

  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      event.preventDefault(); // Prevent default enter behavior

      const currentIndex = this.tagIndex;
      const [rowIndex, fieldNumber] = [currentIndex[0], currentIndex[1]];

      // console.log('Production Debug - Enter pressed:', {
      //   currentIndex,
      //   rowIndex,
      //   fieldNumber,
      //   element: this.el.nativeElement,
      // });

      // Handle non-measurable products
      if (!this.isMeasurable && fieldNumber === '1') {
        this.handleNextRowNavigation(rowIndex);
        return;
      }

      // For measurable products on last field
      if (fieldNumber === '5') {
        this.handleNextRowNavigation(rowIndex);
        return;
      }

      // Regular field navigation
      switch (fieldNumber) {
        case '3':
          this.handleMetricUnitNavigation(rowIndex);
          break;
        case '4':
          this.handleMeasureDetailNavigation(rowIndex);
          break;
        default:
          this.handleRegularFieldNavigation(rowIndex, fieldNumber);
          break;
      }
    }
  }

  private handleMetricUnitNavigation(rowIndex: string) {
    const nextElement = document.querySelector(
      `[data-tag-index="${rowIndex}4"]`,
    ) as HTMLElement;
    // console.log('Production Debug - Metric Unit Navigation:', { nextElement });
    if (nextElement) {
      nextElement.click();
      this.cdr.detectChanges();
    }
  }

  private handleMeasureDetailNavigation(rowIndex: string) {
    const nextElement = document.querySelector(
      `[data-tag-index="${rowIndex}5"]`,
    ) as HTMLElement;
    // console.log('Production Debug - Measure Detail Navigation:', {
    //   nextElement,
    // });
    if (nextElement) {
      nextElement.click();
      this.cdr.detectChanges();
    }
  }

  private handleNextRowNavigation(rowIndex: string) {
    const nextRowFirstInput = document.querySelector(
      `[data-tag-index="${parseInt(rowIndex) + 1}1"]`,
    ) as HTMLElement;

    // console.log('Production Debug - Next Row Navigation:', {
    //   nextRowFirstInput,
    //   currentRow: rowIndex,
    // });

    // If no next row exists, emit lastTagReached
    if (!nextRowFirstInput) {
      // console.log('Last row reached, emitting event');
      this.lastTagReached.emit();
      return;
    }

    // Otherwise focus next row's first input
    nextRowFirstInput.focus();
    if (nextRowFirstInput instanceof HTMLInputElement) {
      nextRowFirstInput.select();
    }
    this.cdr.detectChanges();
  }

  private handleRegularFieldNavigation(rowIndex: string, fieldNumber: string) {
    const nextElement = document.querySelector(
      `[data-tag-index="${rowIndex}${parseInt(fieldNumber) + 1}"]`,
    ) as HTMLElement;

    // console.log('Production Debug - Regular Navigation:', {
    //   nextElement,
    //   rowIndex,
    //   fieldNumber,
    // });

    if (nextElement) {
      nextElement.focus();
      if (nextElement instanceof HTMLInputElement) {
        nextElement.select();
      }
    }
  }
}
