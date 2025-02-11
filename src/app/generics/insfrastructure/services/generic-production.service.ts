import { Injectable } from '@angular/core';
import { GenericProductionGateway } from '../../domain/gateway/GenericProductionGateway';
import { GenericProduction } from '../../domain/model/GenericProduction';
import { GenericProductionUseCase } from '../../domain/usecase/GenericProductionUseCase';
import { ApiResponse } from '../../dto/ApiResponse';
import { GenericStatusService } from './generic-status.service';

@Injectable({
  providedIn: 'root',
})
export abstract class GenericProductionService<
  T extends GenericProduction,
  G extends GenericProductionGateway<T>,
  U extends GenericProductionUseCase<T, G>,
> extends GenericStatusService<T, G, U> {
  constructor(protected override readonly useCase: U) {
    super(useCase);
  }

  public async advanceOrderStatus(id: number): Promise<T> {
    if (!id || id <= 0) {
      throw new Error('Invalid order ID');
    }
    try {
      const response = (await this.useCase.advanceOrderStatus(id, {
        asPromise: true,
      })) as ApiResponse<T>;
      if (!response.success || !response.data?.item) {
        throw new Error(response.message);
      }
      return response.data.item;
    } catch (error) {
      console.error('Error in advanceOrderStatus:', error);
      throw error;
    }
  }

  public async batchAdvanceOrderStatus(ids: number[]): Promise<T[]> {
    if (!ids || ids.length === 0) {
      throw new Error('Invalid order IDs');
    }
    try {
      const response = (await this.useCase.batchAdvanceOrderStatus(ids, {
        asPromise: true,
      })) as ApiResponse<T>;
      if (!response.success || !response.data?.items) {
        throw new Error(response.message);
      }
      return response.data.items;
    } catch (error) {
      console.error('Error in batchAdvanceOrderStatus:', error);
      throw error;
    }
  }

  public async toggleCancelled(id: number): Promise<T> {
    if (!id || id <= 0) {
      throw new Error('Invalid order ID');
    }
    try {
      const response = (await this.useCase.toggleCancelled(id, {
        asPromise: true,
      })) as ApiResponse<T>;
      if (!response.success || !response.data?.item) {
        throw new Error(response.message);
      }
      return response.data.item;
    } catch (error) {
      console.error('Error in toggleCancelled:', error);
      throw error;
    }
  }

  public async togglePaused(id: number): Promise<T> {
    if (!id || id <= 0) {
      throw new Error('Invalid order ID');
    }
    try {
      const response = (await this.useCase.togglePaused(id, {
        asPromise: true,
      })) as ApiResponse<T>;
      if (!response.success || !response.data?.item) {
        throw new Error(response.message);
      }
      return response.data.item;
    } catch (error) {
      console.error('Error in togglePaused:', error);
      throw error;
    }
  }
}
