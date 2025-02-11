import { NgFor, NgIf } from '@angular/common';
import {
  Component,
  effect,
  inject,
  Input,
  OnDestroy,
  OnInit,
  signal,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatOptionModule } from '@angular/material/core';
import { MatDivider } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import {
  MatRadioButton,
  MatRadioChange,
  MatRadioGroup,
} from '@angular/material/radio';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ActivatedRoute, Router } from '@angular/router';
import {
  URL_ADMIN,
  URL_ADMIN_PRODUCTS,
  URL_ADMIN_PRODUCTS_MAIN,
} from '@globals';
import { ValidateIndexSelected } from '@shared';
import { ToastrService } from 'ngx-toastr';
import { EStatus } from '../../../../../../../delivery-orders/domain/models/EStatus';
import { Product } from '../../../../../../../delivery-orders/domain/models/Product';
import { ProductCategory } from '../../../../../../../delivery-orders/domain/models/ProductCategory';
import { ProductType } from '../../../../../../../delivery-orders/domain/models/ProductType';
import { Status } from '../../../../../../../delivery-orders/domain/models/Status';
import { ProductCategoryService } from '../../../../../../../delivery-orders/infrastructure/services/product-category.service';
import { ProductTypeService } from '../../../../../../../delivery-orders/infrastructure/services/product-type.service';
import { ProductService } from '../../../../../../../delivery-orders/infrastructure/services/product.service';

@Component({
  selector: 'app-product-edit',
  imports: [
    ReactiveFormsModule,
    NgIf,
    MatTooltipModule,
    MatFormFieldModule,
    MatInputModule,
    MatExpansionModule,
    MatIconModule,
    MatSelectModule,
    NgFor,
    MatOptionModule,
    MatProgressSpinner,
    MatDivider,
    MatRadioButton,
    MatRadioGroup,
  ],
  templateUrl: './product-edit.component.html',
  styleUrl: './product-edit.component.scss',
})
export class ProductEditComponent implements OnInit, OnDestroy {
  @Input() productId!: string;

  // Services
  protected readonly productService = inject(ProductService);
  private readonly productTypeService = inject(ProductTypeService);
  private readonly productCategoryService = inject(ProductCategoryService);
  private readonly toastrService = inject(ToastrService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  // Component State
  productForm = this.getNewProductForm();

  // usamos los getters para acceder a las listas de los servicios
  get productTypeList(): ProductType[] {
    return this.productTypeService.items();
  }

  get productCategoryList(): ProductCategory[] {
    return this.productCategoryService.items();
  }

  // Solo mantenemos los signals para las listas filtradas ya que son específicas del componente
  filteredProductTypeList = signal<ProductType[]>([]);
  filteredProductCategoryList = signal<ProductCategory[]>([]);
  readonly statusList: Status[] = [
    {
      id: 7,
      name: EStatus.EXIST,
      description: 'existe',
      isDeleted: false,
    },
    {
      id: 8,
      name: EStatus.LOW_STOCK,
      description: 'bajo',
      isDeleted: false,
    },
    {
      id: 9,
      name: EStatus.OUT_OF_STOCK,
      description: 'agotado',
      isDeleted: false,
    },
    {
      id: 10,
      name: EStatus.NEW,
      description: 'nuevo',
      isDeleted: false,
    },
  ];

  step = 0;
  isSaving = false;
  isDisableSave = false;

  constructor() {
    // Setup effect to update form when product changes
    effect(() => {
      const product = this.productService.currentItem();
      if (product && product.id !== -1) {
        this.setFormFields(product);
      }
    });
  }

  async ngOnInit() {
    if (this.productId) {
      await this.productService.setCurrentProductById(parseInt(this.productId));
    }

    // Load product types and categories
    await this.loadProductTypeList();
    await this.loadProductCategoryList();
  }

  ngOnDestroy() {
    this.productService.reset();
  }

  // Modificamos el método loadProductTypeList:
  private async loadProductTypeList() {
    try {
      await this.productTypeService.fetchAllData();
      this.filteredProductTypeList.set(this.productTypeList.slice());
    } catch (error) {
      console.error('Error loading product types:', error);
      this.filteredProductTypeList.set([]);
    }
  }

  // Modificamos el método loadProductCategoryList:
  private async loadProductCategoryList() {
    try {
      await this.productCategoryService.fetchAllData();
      this.filteredProductCategoryList.set(this.productCategoryList.slice());
    } catch (error) {
      console.error('Error loading product categories:', error);
      this.filteredProductCategoryList.set([]);
    }
  }

  async loadProduct(): Promise<void> {
    if (!this.productId) return;

    try {
      await this.productService.setCurrentProductById(parseInt(this.productId));
    } catch (error) {
      console.error('Error loading product:', error);
      this.toastrService.error('Error loading product');
    }
  }

  private getNewProductForm() {
    let formBuilder: FormBuilder = new FormBuilder();
    return formBuilder.group({
      id: [-1, ValidateIndexSelected],
      reference: [''],
      description: ['', Validators.required],
      type: formBuilder.group({
        id: [-1, ValidateIndexSelected],
        name: [''],
        description: [''],
        category: formBuilder.group({
          id: [-1, ValidateIndexSelected],
          name: [''],
          description: [''],
        }),
        isMeasurable: [false],
      }),
      status: formBuilder.group({
        id: [-1, ValidateIndexSelected],
        name: [''],
        description: [''],
      }),
    });
  }

  private setFormFields(currentProduct: Product) {
    this.setFormFieldsProduct(currentProduct);
    if (currentProduct.type && currentProduct.type.id! >= 0) {
      this.setFormFieldsType(currentProduct.type);
    }
    if (currentProduct.status && currentProduct.status.id! >= 0)
      this.setFormFieldsStatus(currentProduct.status);
  }

  private setFormFieldsProduct(product: Product) {
    this.productForm.get('id')?.setValue(product.id!);
    this.productForm.get('reference')?.setValue(product.reference ?? '');
    this.productForm.get('description')?.setValue(product.description ?? '');
  }

  private setFormFieldsType(productType: ProductType) {
    let productTypeControl = this.productForm.get('type');
    if (!productTypeControl) return;

    productTypeControl.get('id')?.setValue(productType.id!);
    productTypeControl
      .get('name')
      ?.setValue(productType.name ? String(productType.name) : '');
    productTypeControl
      .get('description')
      ?.setValue(productType.description ?? '');
    productTypeControl
      .get('isMeasurable')
      ?.setValue(!!productType.isMeasurable);

    if (productType.category && productType.category.id! >= 0)
      this.setFormFieldsCategory(productType.category);
  }

  private setFormFieldsStatus(status: Status) {
    let statusControl = this.productForm.get('status');
    if (!statusControl) return;

    statusControl.get('id')?.setValue(status.id!);
    statusControl.get('name')?.setValue(status.name ?? '');
    statusControl.get('description')?.setValue(status.description ?? '');
  }

  private setFormFieldsCategory(productCategory: ProductCategory) {
    let categoryControl = this.productForm.get('type.category');
    if (!categoryControl) return;

    categoryControl.get('id')?.setValue(productCategory.id!);
    categoryControl
      .get('name')
      ?.setValue(productCategory.name?.toString() ?? '');
    categoryControl
      .get('description')
      ?.setValue(productCategory.description ?? '');
  }

  //// Validators
  onProductTypeSelectionChange($event: MatSelectChange) {
    const id = $event.value;
    const productType = this.findProductTypeById(id);
    if (!productType) return;

    const currentProduct = this.productService.currentItem();
    currentProduct?.type && (currentProduct.type = productType);
    this.setFormFieldsType(productType);
    // this.filteredProductTypeList = this.productTypeList.slice();
  }

  // 1. Corregir findProductTypeById
  private findProductTypeById(id: number): ProductType | undefined {
    return this.productTypeList.find(
      (productType: ProductType) => productType.id === id,
    );
  }

  // 2. Corregir onKeyProductType
  onKeyProductType(target: EventTarget | null) {
    if (target) {
      this.searchProductType((target as HTMLInputElement).value);
    }
  }

  // 3. Corregir searchProductType
  private searchProductType(value: string): void {
    const filter = value.toUpperCase();
    const filtered = this.productTypeList.filter((productType) => {
      if (productType?.name) {
        return productType.name.toUpperCase().startsWith(filter);
      }
      return false;
    });
    this.filteredProductTypeList.set(filtered);
  }

  onIsMeasurableSelectionChange($event: MatRadioChange) {
    const currentProduct = this.productService.currentItem();
    currentProduct?.type && (currentProduct.type.isMeasurable = $event.value === 'true');
  }

  onStatusSelectionChange($event: MatSelectChange) {
    const id = $event.value;
    const status = this.findStatusById(id);
    if (!status) return;

    const currentProduct = this.productService.currentItem();
    if (currentProduct) currentProduct.status = status;
    this.setFormFieldsStatus(status);
  }

  private findStatusById(id: number): Status | undefined {
    return this.statusList.find((status: Status) => status.id === id);
  }

  //// Save
  private getProductFromData(): Product {
    const currentProduct = this.productService.currentItem() || { id: -1, type: null, status: null };
    return {
      id: currentProduct?.id ?? -1,
      description: this.productForm.get('description')?.value ?? '',
      type: {
        id: currentProduct.type?.id ?? -1,
        isMeasurable: currentProduct.type?.isMeasurable ?? false,
      },
      status: {
        id: currentProduct.status?.id ?? -1,
      },
    };
  }

  async onSaveForm() {
    if (!this.productForm.valid) return;

    this.isSaving = true;
    try {
      const product = this.getProductFromData();
      const response = await this.productService.update(product);
      this.afterSaveForm(response.id!, 'Actualizado');
    } catch (error) {
      console.error(error);
      this._showErrorSave();
    } finally {
      this.isSaving = false;
    }
  }

  private _showErrorSave() {
    const mensaje = 'No se pudo guardar el producto, intente nuevamente';
    this.toastrService.error(mensaje, 'Error', {
      closeButton: true,
      progressBar: true,
      timeOut: 5000,
    });
  }

  private afterSaveForm(id: number, action: string) {
    const mensaje = 'Se ha ' + action + ' el producto: ' + id;
    this.toastrService.success(mensaje, action, {
      closeButton: true,
      progressBar: true,
      timeOut: 3000,
    });

    this.router.navigate(
      [URL_ADMIN, URL_ADMIN_PRODUCTS, URL_ADMIN_PRODUCTS_MAIN],
      {
        relativeTo: this.route.root,
      },
    );
    this.isSaving = false;
  }
}
