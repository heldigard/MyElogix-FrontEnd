import { Injectable } from '@angular/core';
import { FormBuilder, Validators, type FormGroup } from '@angular/forms';
import { ValidateIndexSelected } from '@shared';
import { GenericNamedBasicGateway } from '../../domain/gateway/GenericNamedBasicGateway';
import { GenericNamedBasic } from '../../domain/model/GenericNamedBasic';
import { GenericNamedBasicUseCase } from '../../domain/usecase/GenericNamedBasicUseCase';
import { ApiResponse } from '../../dto/ApiResponse';
import { GenericBasicService } from './generic-basic.service'

@Injectable({
  providedIn: 'root',
})
export abstract class GenericNamedBasicService<
  T extends GenericNamedBasic,
  G extends GenericNamedBasicGateway<T>,
  U extends GenericNamedBasicUseCase<T, G>,
> extends GenericBasicService<T, G, U> {
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
}
