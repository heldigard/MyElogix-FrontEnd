import { Injectable, computed, inject, signal } from '@angular/core';
import { EStatus } from '../../delivery-orders/domain/models/EStatus';
import { Status } from '../../delivery-orders/domain/models/Status';
import { StatusUseCase } from '../../delivery-orders/domain/usecase/StatusUseCase';
import { ApiResponse } from '../../generics/dto/ApiResponse';
import { StatusState } from './state/status-state';

@Injectable({
  providedIn: 'root',
})
export class StatusService {
  private readonly statusUseCase: StatusUseCase = inject(StatusUseCase);

  // Create a private state signal with initial values
  private state = signal<StatusState>({
    statusList: [
      {
        id: 1,
        name: EStatus.DRAFT,
        description: 'borrador',
        isDeleted: false,
      },
      {
        id: 2,
        name: EStatus.PENDING,
        description: 'pendiente',
        isDeleted: false,
      },
      {
        id: 3,
        name: EStatus.PRODUCTION,
        description: 'producción',
        isDeleted: false,
      },
      {
        id: 4,
        name: EStatus.FINISHED,
        description: 'finalizado',
        isDeleted: false,
      },
      {
        id: 5,
        name: EStatus.DELIVERED,
        description: 'entregado',
        isDeleted: false,
      },
      {
        id: 6,
        name: EStatus.CANCELLED,
        description: 'anulado',
        isDeleted: false,
      },
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
    ],
    isLoading: false,
  });

  // Expose state as computed signals
  readonly statusList = computed(() => this.state().statusList);
  readonly isLoading = computed(() => this.state().isLoading);
  readonly error = computed(() => this.state().error);

  // Update state method
  private setState(newState: Partial<StatusState>) {
    this.state.update((state) => ({
      ...state,
      ...newState,
    }));
  }

  // Modified fill method to use state
  async fillStatusList(): Promise<void> {
    try {
      this.setState({ isLoading: true, error: undefined });

      const response = (await this.statusUseCase.findAll({
        asPromise: true,
      })) as ApiResponse<Status>;

      if (!response?.success) {
        throw new Error(response.message);
      }

      if (!response.data?.items?.length) {
        this.setState({
          statusList: [],
          isLoading: false,
          error: response.message,
        });
        return;
      }

      this.setState({
        statusList: response.data.items,
        isLoading: false,
      });
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'An unexpected error occurred while fetching status list';

      this.setState({
        statusList: [],
        error: errorMessage,
        isLoading: false,
      });
      console.error('[StatusService] Fill status list error:', error);
    }
  }
  // Method to get status list
  getStatusList(): Status[] {
    return this.statusList();
  }

  getStatusByName(name: EStatus | undefined): Status | undefined {
    if (!name) return undefined;
    return this.statusList().find((status) => status.name === name);
  }

  getStatusById(id: number): Status | undefined {
    if (!id) return undefined;
    return this.statusList().find((status) => status.id === id);
  }
}
