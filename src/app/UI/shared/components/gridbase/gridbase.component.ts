import { Directive, effect, Input, ViewChild } from '@angular/core';
import {
  GridApi,
  type ColDef,
  type GridReadyEvent,
  type RowModelType,
} from 'ag-grid-community';
import type { SearchFormComponent } from '../search-form/search-form.component';

@Directive()
export abstract class GridBaseComponent {
  protected abstract gridApi: GridApi;
  protected defaultColDef: any;
  protected columnDefs!: ColDef[];
  protected overlayLoadingTemplate!: string;
  protected overlayNoRowsTemplate!: string;
  protected rowModelType: RowModelType;
  protected gridHeight: number = 300;
  protected readonly ROW_HEIGHT = 40;
  protected readonly MAX_ROWS = 5;
  protected readonly HEADER_HEIGHT = 26;
  protected readonly MIN_ROWS = 2;
  protected gridOptions: any;
  @ViewChild('searchForm') searchForm!: SearchFormComponent;
  @Input() isLite: boolean = false;

  constructor() {
    this.columnDefs = this.getColumnsDefs();
    this.rowModelType = 'clientSide';
    this.defaultColDef = {
      flex: 1,
      sortable: true,
      filter: true,
      floatingFilter: true,
      editable: false,
      resizable: true,
    };

    this.overlayLoadingTemplate =
      '<span class="ag-overlay-loading-center">Favor espere mientras la base de datos</span>';
    this.overlayNoRowsTemplate =
      '<span style="padding: 10px; border: 2px solid #444; background: lightgoldenrodyellow;">No hay resultados para mostrar</span>';

    this.gridOptions = {
      rowBuffer: 0,
      maxBlocksInCache: 3,
      rowModelType: this.rowModelType,
      paginationAutoPageSize: true,
      animateRows: true,
      groupHeaderHeight: 75,
      floatingFiltersHeight: 26,
      pivotGroupHeaderHeight: 50,
      pivotHeaderHeight: 100,
      overlayLoadingTemplate: this.overlayLoadingTemplate,
      overlayNoRowsTemplate: this.overlayNoRowsTemplate,
      rowHeight: this.ROW_HEIGHT,
      headerHeight: this.HEADER_HEIGHT,
      pagination: true,
      suppressScrollOnNewData: true,
      context: { componentParent: this },
    };

    effect(() => {
      this.refresh();
    });
  }

  protected abstract getColumnsDefs(): ColDef[];
  protected abstract refresh(): void;

  onGridReady(params: GridReadyEvent<any>) {
    this.gridApi = params.api;
    this.gridApi.setGridOption('columnDefs', this.getColumnsDefs());
    this.refresh();
    setTimeout(() => this.updateGridHeight(), 50);
  }

  protected resetFilters() {
    this.gridApi?.setFilterModel(null);
    this.searchForm?.resetFilter();
    this.gridApi?.setGridOption('quickFilterText', '');
  }

  protected updateGridHeight() {
    if (this.gridApi && !this.gridApi.isDestroyed()) {
      setTimeout(() => {
        // Obtener el número de filas en la página actual
        const displayedRows = this.gridApi?.getDisplayedRowCount() || 0;

        // Asegurar que siempre mostramos al menos MIN_ROWS filas
        const rowsToShow = Math.max(
          this.MIN_ROWS,
          Math.min(displayedRows, this.MAX_ROWS),
        );

        // Calcular la altura base
        let totalHeight = this.HEADER_HEIGHT + rowsToShow * this.ROW_HEIGHT;

        // Agregar altura para los filtros flotantes si están habilitados
        if (this.defaultColDef?.floatingFilter) {
          totalHeight += 26; // Altura estándar del filtro flotante
        }

        // Agregar altura para la paginación si hay más filas que el máximo
        if (displayedRows > this.MAX_ROWS) {
          totalHeight += 32;
        }

        // Aplicar la altura calculada
        this.gridHeight = totalHeight + 20;

        // Forzar el redimensionamiento de la grid
        this.gridApi?.setGridOption('domLayout', 'normal');
        const gridElement = document.querySelector(
          '.ag-theme-alpine',
        ) as HTMLElement;
        if (gridElement) {
          gridElement.style.height = `${this.gridHeight}px`;
        }
        this.gridApi?.sizeColumnsToFit();
      });
    }
  }

  onFilterTextBoxChanged(value: string) {
    if (value.trim().length > 0) {
      this.isLite = false;
      // Initialize grid if not already done
      if (this.gridApi && !this.gridApi.isDestroyed()) {
        setTimeout(() => {
          this.gridApi.setGridOption('columnDefs', this.getColumnsDefs());
          setTimeout(() => this.updateGridHeight(), 50);
        });
      }
    }

    // Existing quick filter logic
    if (this.gridApi && !this.gridApi.isDestroyed()) {
      this.gridApi.setGridOption('quickFilterText', value);
    }
  }
}
