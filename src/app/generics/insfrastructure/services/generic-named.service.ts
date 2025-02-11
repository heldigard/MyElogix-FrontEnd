import { Injectable } from '@angular/core';
import { FormBuilder, Validators, type FormGroup } from '@angular/forms';
import { ValidateIndexSelected } from '@shared';
import { GenericService } from './generic.service';
import type { GenericNamedGateway } from '../../domain/gateway/GenericNamedGateway';
import type { GenericNamed } from '../../domain/model/GenericNamed';
import type { GenericNamedUseCase } from '../../domain/usecase/GenericNamedUseCase';
import type { ApiResponse } from '../../dto/ApiResponse';

@Injectable({
  providedIn: 'root',
})
export abstract class GenericNamedService<
  T extends GenericNamed,
  G extends GenericNamedGateway<T>,
  U extends GenericNamedUseCase<T, G>,
> extends GenericService<T, G, U> {
  constructor(protected override readonly useCase: U) {
    super(useCase);
  }

  public override getForm(): FormGroup {
    let formBuilder: FormBuilder = new FormBuilder();
    return formBuilder.group({
      id: [-1, [ValidateIndexSelected]],
      name: ['', [Validators.required, Validators.minLength(3)]],
    });
  }

  public async findByName(name: string): Promise<T> {
    try {
      const response = (await this.useCase.findByName(name, {
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

  public async deleteByName(name: string): Promise<T> {
    try {
      const response = (await this.useCase.deleteByName(name, {
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
}
