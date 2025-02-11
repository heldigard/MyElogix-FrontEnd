import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import type { ICellRendererParams } from 'ag-grid-community';

@Component({
  selector: 'app-order-id-renderer',
  standalone: true,
  imports: [CommonModule, MatTooltipModule],
  templateUrl: './order-id-renderer.component.html',
  styleUrl: './order-id-renderer.component.scss',
})
export class OrderIdRendererComponent implements ICellRendererAngularComp {
  visibleIds: number[] = [];
  remainingCount: number = 0;
  allIds: number[] | string | null = [];

  agInit(params: CustomCellRendererParams): void {
    this.allIds = params.value ?? [];
    const maxVisible = params.maxVisible ?? 3;

    let idsArray: number[] = [];
    if (Array.isArray(this.allIds)) {
      idsArray = this.allIds;
    } else if (this.allIds) {
      idsArray = this.allIds.toString().split(',').map(id => Number(id.trim()));
    }

    this.visibleIds = idsArray.slice(0, maxVisible);
    this.remainingCount = Math.max(0, idsArray.length - maxVisible);
  }

  getAllIdsText(): string {
    if (!this.allIds) {
      return '';
    }

    try {
      if (Array.isArray(this.allIds)) {
        return this.allIds
          .filter(id => id?.toString().trim())
          .join(', ');
      }

      if (typeof this.allIds === 'string') {
        return this.allIds
          .split(',')
          .map(id => id.trim())
          .filter(id => id) // Remove empty strings
          .join(', ');
      }

      const stringValue = String(this.allIds).trim();
      return stringValue || '';

    } catch (error) {
      console.error('Error processing IDs:', error);
      return '';
    }
  }

  refresh(params: ICellRendererParams): boolean {
    return false;
  }
}

interface CustomCellRendererParams extends ICellRendererParams {
  maxVisible?: number;
}
