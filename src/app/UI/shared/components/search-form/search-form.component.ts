import {
  Component,
  EventEmitter,
  ElementRef,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-search-form',
  templateUrl: './search-form.component.html',
  styleUrls: ['./search-form.component.scss'],
  standalone: true,
  imports: [FormsModule, MatFormFieldModule, MatInputModule],
})
export class SearchFormComponent {
  @Input() placeholder = 'Filtro...';
  @Input() label = 'Buscar';
  @Output() filterTextChanged = new EventEmitter<string>();
  @Output() itemSelected = new EventEmitter<string>();
  @ViewChild('filterTextBox') filterTextBox!: ElementRef<HTMLInputElement>;

  onFilterTextBoxChanged(value: string) {
    this.filterTextChanged.emit(value);
  }

  onItemSelected(value: string) {
    this.itemSelected.emit(value);
  }

  focusSearchInput() {
    setTimeout(() => {
      this.filterTextBox.nativeElement.focus();
    });
  }

  resetFilter() {
    this.filterTextBox.nativeElement.value = '';
    this.filterTextChanged.emit('');
  }
}
