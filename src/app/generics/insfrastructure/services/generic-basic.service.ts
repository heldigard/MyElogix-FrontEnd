import { computed, Injectable, signal } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ValidateIndexSelected } from '@shared';
import type { PaginationCriteria } from '../../../shared/domain/models/pagination/PaginationCriteria';
import type { Sort } from '../../../shared/domain/models/pagination/Sort';
import type { GenericBasicGateway } from '../../domain/gateway/GenericBasicGateway';
import type { GenericBasicEntity } from '../../domain/model/GenericBasicEntity';
import type { GenericBasicUseCase } from '../../domain/usecase/GenericBasicUseCase';
import type { ApiResponse } from '../../dto/ApiResponse';
import type { PaginationResponse } from '../../dto/PaginationResponse';
import type { GenericBasicState } from '../state/GenericBasicState';

@Injectable({
  providedIn: 'root',
})
export abstract class GenericBasicService<
  T extends GenericBasicEntity,
  G extends GenericBasicGateway<T>,
  U extends GenericBasicUseCase<T, G>,
> {
  private readonly initialState: GenericBasicState<T> = {
    items: [],
    rowCount: 0,
    pagesCount: 0,
    currentPage: 0,
    currentItem: this.getBlank(),
    isLoading: false,
    error: undefined,
  };
  private readonly state = signal<GenericBasicState<T>>(this.initialState);

  // Exponer getters como computed signals
  public readonly items = computed(() => this.state().items);
  public readonly rowCount = computed(() => this.state().rowCount);
  public readonly pagesCount = computed(() => this.state().pagesCount);
  public readonly currentPage = computed(() => this.state().currentPage);
  public readonly currentItem = computed(() => this.state().currentItem);
  public readonly isLoading = computed(() => this.state().isLoading);
  public readonly error = computed(() => this.state().error);

  constructor(protected readonly useCase: U) {}

  getUseCase(): U {
    return this.useCase;
  }

  // Método para actualizar el estado
  protected setState(newState: Partial<GenericBasicState<T>>) {
    this.state.update((state) => ({
      ...state,
      ...newState,
    }));
  }

  setCurrentItem(item: T, reload: boolean = false) {
    if (item.id === this.currentItem()?.id && !reload) {
      return;
    }

    this.setState({
      currentItem: item,
      error: undefined,
    });
  }

  setIsLoading(isLoading: boolean) {
    this.setState({
      isLoading,
    });
  }

  setError(error: string) {
    this.setState({
      error,
    });
  }

  /**
   * Fetches all data from the service and updates the internal data list signal.
   *
   * @param options - Optional configuration object for the fetch operation
   * @param options.sortOrders - Optional array of Sort objects to specify sorting criteria
   * @throws {Error} If the fetch operation fails
   * @returns Promise that resolves when the operation completes
   */
  public async fetchAllData(options?: { sortOrders?: Sort[] }): Promise<void> {
    try {
      const response: T[] = await this.findAll(options);

      // Actualizar el state con los nuevos datos
      this.setState({
        items: response,
      });
    } catch (error) {
      console.error('Error updating data list:', error);
      throw error;
    }
  }

  // Método para actualizar la lista con paginación
  public async updateDataList(
    pagination: PaginationCriteria,
  ): Promise<PaginationResponse<T>> {
    try {
      const response = await this.findAllPagination(pagination);

      // Actualizar todo el estado de una vez
      this.setState({
        items: response.rows,
        rowCount: response.rowCount,
        pagesCount: response.pagesCount,
        currentPage: response.currentPage,
      });

      return response;
    } catch (error) {
      console.error('Error updating data list:', error);
      throw error;
    }
  }

  // Método para limpiar la lista
  reset(): void {
    this.setState(this.initialState);
  }

  resetItem(): void {
    this.setState({
      currentItem: this.getBlank(),
      isLoading: false,
      error: undefined,
    });
  }

  // Método para agregar un elemento
  addItem(item: T): void {
    this.setState({
      items: [...this.items(), item],
    });
  }

  // Método para eliminar un elemento
  removeItem(id: number): void {
    this.setState({
      items: this.items().filter((item: any) => item.id !== id),
    });
  }

  public getBlank(): T {
    return {} as T;
  }

  public getForm(): FormGroup {
    let formBuilder: FormBuilder = new FormBuilder();
    return formBuilder.group({
      id: [-1, [ValidateIndexSelected]],
    });
  }

  public async findById(
    id: number,
    options?: {
      includeDeleted?: boolean;
    },
  ): Promise<T> {
    try {
      const response = (await this.useCase.findById(id, {
        includeDeleted: options?.includeDeleted ?? false,
        asPromise: true,
      })) as ApiResponse<T>;

      if (!response?.success || !response.data?.item) {
        throw new Error(response?.message ?? 'Failed to fetch data');
      }

      return response.data.item;
    } catch (error) {
      console.error('Error in findById:', error);
      throw error; // Re-throw to let caller handle the error
    }
  }

  public async findByIdIn(
    ids: number[],
    options?: {
      sortOrders?: Sort[];
      includeDeleted?: boolean;
    },
  ): Promise<T[]> {
    try {
      const response = (await this.useCase.findByIdIn(ids, {
        sortOrders: options?.sortOrders,
        includeDeleted: options?.includeDeleted ?? false,
        asPromise: true,
      })) as ApiResponse<T>;

      if (!response?.success || !response.data?.items) {
        throw new Error(response?.message ?? 'Failed to fetch data');
      }

      return response.data.items;
    } catch (error) {
      console.error('Error in findByIdIn:', error);
      throw error; // Re-throw to let caller handle the error
    }
  }

  public async findAll(options?: {
    sortOrders?: Sort[];
    includeDeleted?: boolean;
  }): Promise<T[]> {
    try {
      const response = (await this.useCase.findAll({
        sortOrders: options?.sortOrders,
        includeDeleted: options?.includeDeleted ?? false,
        asPromise: true,
      })) as ApiResponse<T>;

      if (!response?.success || !response.data?.items) {
        throw new Error(response?.message ?? 'Failed to fetch data');
      }

      return response.data.items;
    } catch (error) {
      console.error('Error in findAll:', error);
      throw error; // Re-throw to let caller handle the error
    }
  }

  // User el metodo updateDataList para obtener la lista con paginación
  private async findAllPagination(
    pagination: PaginationCriteria,
    options?: {
      sortOrders?: Sort[];
      includeDeleted?: boolean;
    },
  ): Promise<PaginationResponse<T>> {
    try {
      const response = (await this.useCase.findAllPagination(pagination, {
        sortOrders: options?.sortOrders,
        includeDeleted: options?.includeDeleted ?? false,
        asPromise: true,
      })) as PaginationResponse<T>;

      if (!response?.success || !response.rows) {
        throw new Error(response?.message ?? 'Failed to fetch data');
      }

      return response;
    } catch (error) {
      console.error('Error in findAllPagination:', error);
      throw error; // Re-throw to let caller handle the error
    }
  }
}
