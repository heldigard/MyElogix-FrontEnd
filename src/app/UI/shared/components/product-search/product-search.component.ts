import { NgIf } from '@angular/common';
import {
  Component,
  computed,
  effect,
  ElementRef,
  inject,
  Input,
  ViewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MODULE_COMMERCIAL, MODULE_PRODUCT_ADMIN } from '@globals';
import { statusFormatter } from '@shared';
import { AgGridModule } from 'ag-grid-angular';
import {
  CellClassParams,
  ColDef,
  GridApi,
  GridReadyEvent,
  RowModelType,
} from 'ag-grid-community';
import { EStatus } from '../../../../delivery-orders/domain/models/EStatus';
import type { MeasureDetail } from '../../../../delivery-orders/domain/models/MeasureDetail';
import type { MetricUnit } from '../../../../delivery-orders/domain/models/MetricUnit';
import { Product } from '../../../../delivery-orders/domain/models/Product';
import { MeasureDetailService } from '../../../../delivery-orders/infrastructure/services/measure-detail.service';
import { MetricUnitService } from '../../../../delivery-orders/infrastructure/services/metric-unit.service';
import { ProductService } from '../../../../delivery-orders/infrastructure/services/product.service';
import { ProductOrderService } from '../../../../product-order/infrastructure/product-order.service';
import { ClickEditProductRendererComponent } from '../../../modules/administration/pages/product-administration/components/click-edit-product-renderer/click-edit-product-renderer.component';
import { EditProductRendererComponent } from '../../../modules/administration/pages/product-administration/components/edit-product-renderer/edit-product-renderer.component';
import { ClickCreateProductOrderRendererComponent } from '../../../modules/delivery-orders/pages/commercial-delivery-order/components/click-create-product-order-renderer/click-create-product-order-renderer.component';
import { CreateProductOrderRendererComponent } from '../../../modules/delivery-orders/pages/commercial-delivery-order/components/create-product-order-renderer/create-product-order-renderer.component';
import { CustomTooltipProductComponent } from '../../../modules/delivery-orders/pages/commercial-delivery-order/components/custom-tooltip-product/custom-tooltip-product.component';

@Component({
  selector: 'app-product-search',
  templateUrl: './product-search.component.html',
  styleUrls: ['./product-search.component.scss'],
  standalone: true,
  imports: [
    MatButtonModule,
    MatTooltipModule,
    MatIconModule,
    AgGridModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    NgIf,
  ],
})
export class ProductSearchComponent {
  private gridApi!: GridApi<Product>;
  public columnDefs!: ColDef[];
  public defaultColDef: ColDef;

  public overlayLoadingTemplate: string;
  public overlayNoRowsTemplate: string;
  private readonly rowModelType: RowModelType;
  private readonly ROW_HEIGHT = 50; // altura de cada fila
  private readonly MAX_ROWS = 10; // máximo número de filas a mostrar
  private readonly HEADER_HEIGHT = 26; // altura del header
  public gridHeight = this.HEADER_HEIGHT; // altura inicial
  public gridOptions: any;
  get rowData(): Product[] {
    return this.productService.items();
  }
  @Input() isLite: boolean = false;
  @ViewChild('filterTextBox') filterTextBox!: ElementRef<HTMLInputElement>;
  @Input() currentModule!: string;
  private readonly productService: ProductService = inject(ProductService);
  private readonly productOrderService: ProductOrderService =
    inject(ProductOrderService);

  private readonly metricUnitService: MetricUnitService =
    inject(MetricUnitService);
  private readonly measureDetailService: MeasureDetailService =
    inject(MeasureDetailService);

  private readonly metricUnits = computed(() => {
    const units = this.metricUnitService.items();
    if (units.length === 0) {
      // Llamada asíncrona para cargar los datos
      this.metricUnitService.fetchAllData().catch((error) => {
        console.error('Error fetching metric units:', error);
      });
    }
    return units;
  });

  get metricUnitList(): MetricUnit[] {
    return this.metricUnits();
  }

  private readonly measureDetails = computed(() => {
    const units = this.measureDetailService.items();
    if (units.length === 0) {
      // Llamada asíncrona para cargar los datos
      this.measureDetailService.fetchAllData().catch((error) => {
        console.error('Error fetching measure details:', error);
      });
    }
    return units;
  });

  get measureDetailList(): MeasureDetail[] {
    return this.measureDetails();
  }

  constructor() {
    // Handle product data updates
    effect(() => {
      this.refresh();
    });

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
      '<span class="ag-overlay-loading-center">Favor espere mientras consulta los productos</span>';
    this.overlayNoRowsTemplate =
      '<span style="padding: 10px; border: 2px solid #444; background: lightgoldenrodyellow;">No se encontro ningun producto</span>';

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
      domLayout: 'autoHeight',
      pagination: true,
      suppressScrollOnNewData: true,
      context: { componentParent: this },
    };
  }

  refresh(force: boolean = false) {
    if (this.gridApi && !this.gridApi.isDestroyed()) {
      this.gridApi.setGridOption('loading', true);
      // Esto disparará el effect cuando se actualice el signal

      if (this.rowData.length === 0 || force) {
        this.productService.fetchAllData({
          sortOrders: this.productService.createSortOrders(),
        });
      }

      this.gridApi.setGridOption('loading', false);
    }
  }

  getColumnsDefs(): any {
    return [
      {
        headerName: '',
        minWidth: 25,
        maxWidth: 25,
        filter: false,
        floatingFilter: false,
        resizable: false,
        cellRenderer: this.getCellRendererComponent(),
      },
      {
        headerName: 'Ref',
        field: 'reference',
        minWidth: 80,
        // maxWidth: 90,
        cellRenderer: this.getClickRendererComponent(),
        tooltipField: 'Ref',
        tooltipComponent: CustomTooltipProductComponent,
        // filter: 'agTextColumnFilter', // Use the text filter
        filter: false,
        // resizable: false,
      },
      {
        headerName: 'Descripción',
        field: 'description',
        minWidth: 160,
        // maxWidth: 160,
        cellRenderer: this.getClickRendererComponent(),
        tooltipField: 'description',
        tooltipComponent: CustomTooltipProductComponent,
        filter: false,
      },
      {
        headerName: 'Tipo',
        field: 'type.name',
        minWidth: 160,
        // maxWidth: 160,
        tooltipField: 'type',
        tooltipComponent: CustomTooltipProductComponent,
        filter: false,
      },
      {
        headerName: 'Estado',
        field: 'status.name',
        minWidth: 90,
        maxWidth: 90,
        cellStyle: this.cellStyleStatus,
        valueFormatter: statusFormatter,
      },
      {
        headerName: 'Categoria',
        field: 'type.category.name',
        minWidth: 120,
        // maxWidth: 120,
      },
      {
        headerName: 'Hits',
        field: 'hits',
        filter: false,
        maxWidth: 80,
        // minWidth: 60,
        type: 'numericColumn',
      },
      {
        headerName: 'ID',
        field: 'id',
        minWidth: 80,
        // maxWidth: 60,
        type: 'numericColumn',
        filter: false,
        cellRenderer: ClickCreateProductOrderRendererComponent,
      },
    ];
  }

  getClickRendererComponent() {
    if (this.currentModule === MODULE_COMMERCIAL) {
      return ClickCreateProductOrderRendererComponent;
    } else if (this.currentModule === MODULE_PRODUCT_ADMIN) {
      return ClickEditProductRendererComponent;
    }
    return undefined;
  }

  getCellRendererComponent() {
    if (this.currentModule === MODULE_COMMERCIAL) {
      return CreateProductOrderRendererComponent;
    } else if (this.currentModule === MODULE_PRODUCT_ADMIN) {
      return EditProductRendererComponent;
    }
    return undefined;
  }

  cellStyleStatus(params: CellClassParams<any>): any {
    switch (params.value) {
      case EStatus.OUT_OF_STOCK: {
        return {
          background: 'red',
          color: 'white',
        };
      }
      case EStatus.LOW_STOCK: {
        return { background: 'yellow', color: 'black' };
      }
      case EStatus.EXIST: {
        return { background: 'green', color: 'white' };
      }
      default: {
        return { background: 'transparent', color: 'black' };
      }
    }
  }

  onGridReady(params: GridReadyEvent<Product>) {
    this.gridApi = params.api;
    this.gridApi.setGridOption('columnDefs', this.getColumnsDefs());
    this.refresh();
    this.updateGridHeight();
  }

  private updateGridHeight() {
    if (this.gridApi) {
      // Obtener solo las filas en la página actual
      const displayedRows = this.gridApi.getDisplayedRowCount();
      const rowsToShow = Math.min(displayedRows, this.MAX_ROWS);
      this.gridHeight = this.HEADER_HEIGHT + rowsToShow * this.ROW_HEIGHT;

      // Agregar altura extra para los controles de paginación si hay más filas que el máximo
      if (this.rowData.length > this.MAX_ROWS) {
        this.gridHeight += 32; // Altura para los controles de paginación
      }
    }
  }
  onFilterTextBoxChanged(value: string) {
    if (this.isLite && value.trim().length > 0) {
      this.isLite = false;
      // Initialize grid if not already done
      if (this.gridApi && !this.gridApi.isDestroyed()) {
        setTimeout(() => {
          this.gridApi.setGridOption('columnDefs', this.getColumnsDefs());
          this.updateGridHeight();
        });
      }
    }

    // Existing quick filter logic
    if (this.gridApi && !this.gridApi.isDestroyed()) {
      this.gridApi.setGridOption('quickFilterText', value);
    }
  }

  private resetFilters() {
    this.gridApi?.setFilterModel(null);
    this.filterTextBox.nativeElement.value = '';
    this.gridApi?.setGridOption('quickFilterText', '');
  }

  public addProductByReference(reference: string) {
    if (!reference.trim()) {
      return;
    }

    // First try exact reference match
    let product: Product | undefined =
      this.productService.findInListByReference(reference);

    // If no exact match found, get first product from current grid list
    if (!product && this.gridApi) {
      const gridRows = this.gridApi.getDisplayedRowCount();
      if (gridRows > 0) {
        const firstRow = this.gridApi.getDisplayedRowAtIndex(0);
        if (firstRow) {
          product = firstRow.data;
        }
      }
    }

    // If we found a product either way, set it as current
    if (product) {
      this.productService.setCurrentItem(product);
      this.productOrderService.onAddProduct(
        product,
        this.metricUnitList,
        this.measureDetailList,
      );
      this.productOrderService.updateFormValidity(false);
      this.resetFilters();
    }
  }

  focusSearchInput() {
    setTimeout(() => {
      this.filterTextBox.nativeElement.focus();
    });
  }
}
