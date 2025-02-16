import { inject, Injectable } from '@angular/core';
import { FormBuilder, FormControl, type FormGroup } from '@angular/forms';
import { GenericStatusService } from '../../../generics/insfrastructure/services/generic-status.service';
import { Product } from '../../domain/models/Product';
import { ProductUseCase } from '../../domain/usecase/ProductUseCase';
import type { ApiResponse } from '../../../generics/dto/ApiResponse';
import type { ProductOrder } from '../../../product-order/domain/model/ProductOrder';
import type { Sort } from '../../../shared/domain/models/pagination/Sort';
import type { ProductGateway } from '../../domain/models/gateways/ProductGateway';

@Injectable({
  providedIn: 'root',
})
export class ProductService extends GenericStatusService<
  Product,
  ProductGateway,
  ProductUseCase
> {
  constructor() {
    super(inject(ProductUseCase));
  }
  public getFormFromProduct(productOrder: ProductOrder): FormGroup {
    const formBuilder = new FormBuilder();
    return formBuilder.group({
      id: new FormControl<number>(productOrder.product.id!),
      reference: new FormControl<string>(productOrder.product.reference ?? ''),
      description: new FormControl<string>(
        productOrder.product.description ?? '',
      ),
      type: formBuilder.group({
        id: new FormControl<number>(productOrder.product.type?.id ?? 0),
        measurable: new FormControl<boolean>(
          productOrder.product.type?.isMeasurable || false,
        ),
      }),
    });
  }

  async setCurrentProductById(id: number, reload = false) {
    if (!this.shouldUpdate(id, reload)) return;

    try {
      this.setIsLoading(true);
      const product = await this.findById(id);
      this.setCurrentItem(product, true);
    } catch (error) {
      this.setError((error as any).message);
      this.resetItem();
      throw error;
    } finally {
      this.setIsLoading(false);
    }
  }

  // 5. Helpers privados para lógica de actualización
  private shouldUpdate(id: number, reload: boolean): boolean {
    return id !== this.currentItem()?.id || reload;
  }

  public async findByReference(
    reference: string,
    options?: {
      includeDeleted?: boolean;
    },
  ): Promise<Product> {
    try {
      const response = (await this.useCase.findByReference(reference, {
        includeDeleted: options?.includeDeleted ?? false,
        asPromise: true,
      })) as ApiResponse<Product>;

      if (!response?.success || !response.data?.item) {
        throw new Error(response?.message ?? 'Failed to fetch data');
      }

      return response.data.item;
    } catch (error) {
      console.error('Error in findById:', error);
      throw error; // Re-throw to let caller handle the error
    }
  }

  public findInListByReference(reference: string): Product | undefined {
    return this.items().find(
      (product: Product) => product.reference === reference,
    );
  }

  public createSortOrders(): Sort[] {
    return [
      {
        direction: 'DESC',
        property: 'hits',
      },
      {
        direction: 'ASC',
        property: 'reference',
      },
    ];
  }
}
