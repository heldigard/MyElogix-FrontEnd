import { Injectable } from '@angular/core';
import { EStatus } from '../../../delivery-orders/domain/models/EStatus';
import { GenericStatusGateway } from '../../domain/gateway/GenericStatusGateway';
import { GenericStatus } from '../../domain/model/GenericStatus';
import { GenericStatusUseCase } from '../../domain/usecase/GenericStatusUseCase';
import { ApiResponse } from '../../dto/ApiResponse';
import { GenericService } from './generic.service';

@Injectable({
  providedIn: 'root',
})
export abstract class GenericStatusService<
  T extends GenericStatus,
  G extends GenericStatusGateway<T>,
  U extends GenericStatusUseCase<T, G>,
> extends GenericService<T, G, U> {
  constructor(protected override readonly useCase: U) {
    super(useCase);
  }
  public async updateStatus(id: number, status: EStatus): Promise<T> {
    try {
      const response = (await this.useCase.updateStatus(id, status, {
        asPromise: true,
      })) as ApiResponse<T>;
      if (!response.success || !response.data?.item) {
        throw new Error(response.message);
      }
      return response.data.item;
    } catch (error) {
      console.error('Error in updateStatus:', error);
      throw error;
    }
  }
}
