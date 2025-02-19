import { NgIf } from '@angular/common';
import { Component, computed, inject, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MODULE_COMMERCIAL, MODULE_PRODUCT_ADMIN } from '@globals';
import { statusFormatter } from '@shared';
import { AgGridModule } from 'ag-grid-angular';
import { CellClassParams, GridApi } from 'ag-grid-community';
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
import { SearchFormComponent } from '../search-form/search-form.component';
import { GridBaseComponent } from '../gridbase/gridbase.component';

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
    SearchFormComponent,
    NgIf,
  ],
})
export class ProductSearchComponent extends GridBaseComponent {
  protected gridApi!: GridApi<Product>;
  get rowData(): Product[] {
    return this.productService.items();
  }
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
    super();

    this.overlayLoadingTemplate =
      '<span class="ag-overlay-loading-center">Favor espere mientras consulta los productos</span>';
  }

  refresh(force: boolean = false) {
    if (this.gridApi && !this.gridApi.isDestroyed()) {
      this.gridApi?.setGridOption('loading', true);
      // Esto disparará el effect cuando se actualice el signal

      if (this.rowData.length === 0 || force) {
        this.productService.fetchAllData({
          sortOrders: this.productService.createSortOrders(),
        });
      }

      this.gridApi?.setGridOption('loading', false);
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

  public addProduct(reference: string) {
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
      this.searchForm.focusSearchInput();
    });
  }
}
