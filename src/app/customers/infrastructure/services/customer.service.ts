import { inject, Injectable } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { GenericNamedService } from '../../../generics/insfrastructure/services/generic-named.service';
import { ValidateIndexSelected, ValidatePhone } from '../../../UI/shared';
import { CustomerUseCase } from '../../domain/usecase/CustomerUseCase';
import type { Customer } from '../../domain/models/Customer';
import type { CustomerGateway } from '../../domain/models/gateways/CustomerGateway';

@Injectable({
  providedIn: 'root',
})
export class CustomerService extends GenericNamedService<
  Customer,
  CustomerGateway,
  CustomerUseCase
> {
  constructor() {
    super(inject(CustomerUseCase));
  }

  async setCurrentCustomerById(id: number, reload: boolean = false) {
    if (id === this.currentItem()?.id && !reload) {
      return;
    }

    if (this.isLoading()) {
      return;
    }

    try {
      this.setIsLoading(true);
      const customer = await this.findById(id);
      this.setState({
        currentItem: customer,
        error: undefined,
      });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Error loading customer';
      this.setError(errorMessage);
      console.error('Error loading customer:', error);
      this.resetItem();
      throw error;
    } finally {
      this.setIsLoading(false);
    }
  }

  public override getBlank(): Customer {
    return {
      branchOfficeList: [],
    };
  }

  public override getForm() {
    let formBuilder: FormBuilder = new FormBuilder();
    return formBuilder.group({
      customer: formBuilder.group({
        documentNumber: [-1],
        name: ['', [Validators.required, Validators.minLength(3)]],
        email: [''],
        phone: ['', [ValidatePhone]],
      }),
      documentType: formBuilder.group({
        id: [-1, [ValidateIndexSelected]],
        name: [''],
      }),
      membership: formBuilder.group({
        name: [''],
        description: [''],
      }),
      branchOfficeList: formBuilder.array([]),
    });
  }

  async updateCustomer(customer: Customer): Promise<Customer> {
    try {
      this.setIsLoading(true);
      const updatedCustomer = await this.update(customer);
      this.setState({
        currentItem: updatedCustomer,
        error: undefined,
      });
      return updatedCustomer;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Error updating customer';
      this.setError(errorMessage);
      this.resetItem();
      throw error;
    } finally {
      this.setIsLoading(false);
    }
  }
}
