import { HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GenericBasicService } from './generic-basic.service';
import type { GenericGateway } from '../../domain/gateway/GenericGateway';
import type { GenericEntity } from '../../domain/model/GenericEntity';
import type { GenericUseCase } from '../../domain/usecase/GenericUseCase';
import type { ApiResponse } from '../../dto/ApiResponse';

@Injectable({
  providedIn: 'root',
})
export abstract class GenericService<
  T extends GenericEntity,
  G extends GenericGateway<T>,
  U extends GenericUseCase<T, G>,
> extends GenericBasicService<T, G, U> {
  constructor(protected override readonly useCase: U) {
    super(useCase);
  }

  public async add(entity: T): Promise<T> {
    try {
      const response = (await this.useCase.add(entity, {
        asPromise: true,
      })) as ApiResponse<T>;
      if (!response.success || !response.data?.item) {
        throw new Error(response.message);
      }
      return response.data.item;
    } catch (error) {
      console.error('Error in add:', error);
      throw error;
    }
  }

  public async update(entity: T): Promise<T> {
    try {
      const response = (await this.useCase.update(entity, {
        asPromise: true,
      })) as ApiResponse<T>;
      if (!response.success || !response.data?.item) {
        throw new Error(response.message);
      }
      return response.data.item;
    } catch (error) {
      console.error('Error in update:', error);
      throw error;
    }
  }

  public async downloadExcelFile(): Promise<HttpResponse<Blob>> {
    try {
      const response = (await this.useCase.downloadExcelFile({
        asPromise: true,
      })) as HttpResponse<Blob>;
      return response;
    } catch (error) {
      console.error('Error downloading excel file:', error);
      throw error;
    }
  }

  public async uploadExcelFile(formData: FormData): Promise<any> {
    try {
      return await this.useCase.uploadExcelFile(formData);
    } catch (error) {
      console.error('Error uploading excel file:', error);
      throw error;
    }
  }
}
