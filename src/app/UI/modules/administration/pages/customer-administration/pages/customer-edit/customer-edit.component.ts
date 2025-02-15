import { NgClass, NgFor, NgIf } from '@angular/common';
import { Component, inject, Input, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatOptionModule } from '@angular/material/core';
import { MatDivider } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ActivatedRoute, Router } from '@angular/router';
import { URL_ADMIN, URL_ADMIN_CLIENTS, URL_ADMIN_CLIENTS_MAIN } from '@globals';
import { getBranchOfficeForm } from '@shared';
import { ToastrService } from 'ngx-toastr';
import { BranchOffice } from '../../../../../../../customers/domain/models/BranchOffice';
import { City } from '../../../../../../../customers/domain/models/City';
import { ContactPerson } from '../../../../../../../customers/domain/models/ContactPerson';
import { Customer } from '../../../../../../../customers/domain/models/Customer';
import { DeliveryZone } from '../../../../../../../customers/domain/models/DeliveryZone';
import { DocumentType } from '../../../../../../../customers/domain/models/DocumentType';
import { Membership } from '../../../../../../../customers/domain/models/Membership';
import { Neighborhood } from '../../../../../../../customers/domain/models/Neighborhood';
import { CityService } from '../../../../../../../customers/infrastructure/services/city.service';
import { CustomerService } from '../../../../../../../customers/infrastructure/services/customer.service';
import { DeliveryZoneService } from '../../../../../../../customers/infrastructure/services/delivery-zone.service';
import { DocumentTypeService } from '../../../../../../../customers/infrastructure/services/document-type.service';
import { MembershipService } from '../../../../../../../customers/infrastructure/services/membership.service';
import { NeighborhoodService } from '../../../../../../../customers/infrastructure/services/neighborhood.service';
import { NumbersOnlyDirective } from '../../../../directives/numbers-only.directive';
import { effect } from '@angular/core';

@Component({
  selector: 'app-customer-edit',
  imports: [
    ReactiveFormsModule,
    NgIf,
    NgClass,
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
    NumbersOnlyDirective,
  ],
  templateUrl: './customer-edit.component.html',
  styleUrl: './customer-edit.component.scss',
})
export class CustomerEditComponent implements OnInit, OnDestroy {
  @Input() customerId!: string;
  // Reemplazar las propiedades de listas por getters
  get documentTypeList(): DocumentType[] {
    return this.documentTypeService.items();
  }

  get membershipList(): Membership[] {
    return this.membershipService.items();
  }

  get cityList(): City[] {
    return this.cityService.items();
  }

  get neighborhoodList(): Neighborhood[] {
    return this.neighborhoodService.items();
  }

  get deliveryZoneList(): DeliveryZone[] {
    return this.deliveryZoneService.items();
  }

  public customerForm!: FormGroup;
  public filteredCityList!: City[];
  public filteredNeighborhoodList!: Neighborhood[];
  public filteredDeliveryZoneList!: DeliveryZone[];
  private readonly cityService: CityService = inject(CityService);
  private readonly neighborhoodService: NeighborhoodService =
    inject(NeighborhoodService);
  private readonly membershipService: MembershipService =
    inject(MembershipService);
  private readonly deliveryZoneService: DeliveryZoneService =
    inject(DeliveryZoneService);
  private readonly documentTypeService: DocumentTypeService =
    inject(DocumentTypeService);
  private readonly toastrService: ToastrService = inject(ToastrService);
  // public imgForMembership!: string;
  public step: number;
  public isSaving!: boolean;
  public isDisableSave!: boolean;

  private readonly router: Router = inject(Router);
  private readonly route: ActivatedRoute = inject(ActivatedRoute);
  protected readonly customerService: CustomerService = inject(CustomerService);

  constructor() {
    this.step = 0;
    this.filteredCityList = [];
    this.filteredNeighborhoodList = [];
    this.isSaving = false;
    this.isDisableSave = false;

    // Añadir effect para monitorear cambios en currentItem
    effect(() => {
      const currentCustomer = this.customerService.currentItem();
      if (currentCustomer && this.customerForm) {
        // Solo actualizar el formulario si hay datos y el form está inicializado
        this.setFormFields(currentCustomer);
      }
    });
  }

  ngOnInit() {
    this.loadAllLists();
    this.isSaving = false;
    this.customerService.reset();
    this.customerForm = this.customerService.getForm();
    this.loadCustomer();
    this.filteredCityList = this.cityList.slice();
    this.filteredNeighborhoodList = this.neighborhoodList.slice();
    this.filteredDeliveryZoneList = this.deliveryZoneList.slice();
  }

  ngOnDestroy() {
    this.customerService.reset();
  }

  async loadAllLists() {
    // Cargar datos usando los nuevos métodos async
    await Promise.all([
      this.loadDocumentTypeList(),
      this.loadMembershipList(),
      this.loadCityList(),
      this.loadNeighborhoodList(),
      this.loadDeliveryZoneList(),
    ]);
  }

  async loadCustomer() {
    const id = this.route.snapshot.params['id'];
    if (id) {
      await this.customerService.setCurrentCustomerById(Number(id));
    }
  }

  async loadDocumentTypeList() {
    await this.documentTypeService.fetchAllData();
  }

  async loadMembershipList() {
    await this.membershipService.fetchAllData();
  }

  async loadCityList() {
    await this.cityService.fetchAllData();
    this.filteredCityList = this.cityList.slice();
  }

  async loadNeighborhoodList() {
    await this.neighborhoodService.fetchAllData();
    this.filteredNeighborhoodList = this.neighborhoodList.slice();
  }

  async loadDeliveryZoneList() {
    await this.deliveryZoneService.fetchAllData();
    this.filteredDeliveryZoneList = this.deliveryZoneList.slice();
  }

  resetBranchOffices() {
    if (this.branchOffices()?.length) {
      this.customerForm.get('branchOfficeList')?.reset();
      this.branchOffices()?.clear();
    }
  }

  onBranchOfficeSelectionChange($event: MatSelectChange) {}

  private setFormFields(currentCustomer: Customer) {
    // Guard clause para validación temprana
    if (!currentCustomer) {
      console.warn('No customer data provided to setFormFields');
      return;
    }

    try {
      // Aplicar actualizaciones en orden
      this.setFormFieldsCustomer(currentCustomer);

      if (currentCustomer.documentType) {
        this.setFormFieldsDocumentType(currentCustomer.documentType);
      }

      if (currentCustomer.membership) {
        this.setFormFieldsMembership(currentCustomer.membership);
      }

      if (currentCustomer.branchOfficeList?.length) {
        this.addBranchOfficeList(currentCustomer.branchOfficeList);
      }
    } catch (error) {
      console.error('Error setting form fields:', error);
    }
  }

  private setFormFieldsCustomer(customer: Customer) {
    const customerControl = this.customerForm.get('customer');
    if (!customerControl) {
      console.warn('Customer form group not found');
      return;
    }

    customerControl.patchValue(
      {
        id: customer.id ?? '',
        name: customer.name ?? '',
        email: customer.email ?? '',
        phone: customer.phone ?? '',
        documentNumber: customer.documentNumber ?? '',
      },
      { emitEvent: false },
    );
  }

  private setFormFieldsDocumentType(documentType: DocumentType) {
    const documentTypeControl = this.customerForm.get('documentType');
    if (!documentTypeControl) {
      console.warn('DocumentType form group not found');
      return;
    }

    documentTypeControl.patchValue(
      {
        id: documentType.id,
        name: documentType.name ?? '',
      },
      { emitEvent: false },
    );
  }

  private setFormFieldsMembership(membership: Membership) {
    const membershipControl = this.customerForm.get('membership');
    if (!membershipControl) {
      console.warn('Membership form group not found');
      return;
    }

    membershipControl.patchValue(
      {
        id: membership.id ?? -1,
        name: membership.name ?? '',
        description: membership.description ?? '',
      },
      { emitEvent: false },
    );
  }

  private addBranchOfficeList(branchOfficeList: BranchOffice[]) {
    this.resetBranchOffices();
    branchOfficeList.forEach((branchOffice: BranchOffice) => {
      this.addBranchOfficeForm(getBranchOfficeForm(branchOffice));
    });
  }

  branchOffices(): FormArray {
    return this.customerForm.get('branchOfficeList') as FormArray;
  }

  addNewBranchOfficeForm() {
    this.addBranchOfficeForm(getBranchOfficeForm(undefined));
  }

  addBranchOfficeForm(branchOfficeForm: any) {
    this.branchOffices().push(branchOfficeForm);
  }

  setStep(index: number) {
    this.step = index;
  }

  nextStep() {
    this.step++;
  }

  prevStep() {
    this.step--;
  }

  onDocumentTypeSelectionChange($event: MatSelectChange) {
    const id = $event.value;
    const documentType = this.findDocumentTypeById(id);
    if (!documentType) return;

    let documentTypeForm = this.customerForm.get('documentType');
    documentTypeForm?.get('id')?.setValue(documentType?.id);
    documentTypeForm?.get('name')?.setValue(documentType?.name);
  }

  private findDocumentTypeById(id: number): DocumentType | undefined {
    return this.documentTypeList.find(
      (documentType: DocumentType) => documentType.id === id,
    );
  }

  onMembershipSelectionChange($event: MatSelectChange) {
    const id = $event.value;
    const membership = this.findMembershipById(id);
    if (!membership) return;

    let membershipForm = this.customerForm.get('membership');
    membershipForm?.get('id')?.setValue(membership?.id);
    membershipForm?.get('name')?.setValue(membership?.name);
  }

  private findMembershipById(id: number): Membership | undefined {
    return this.membershipList.find(
      (membership: Membership) => membership.id === id,
    );
  }

  onCitySelectionChange($event: MatSelectChange, index: number) {
    try {
      const cityId = $event.value;
      const city = this.findCityById(cityId);

      if (!city) {
        console.warn('City not found for id:', cityId);
        return;
      }

      // Get branch office form array
      const branchOfficesArray = this.branchOffices();
      if (!branchOfficesArray) {
        console.warn('Branch offices form array not found');
        return;
      }

      // Get specific branch office form group
      const branchOfficeGroup = branchOfficesArray.at(index);
      if (!branchOfficeGroup) {
        console.warn('Branch office form group not found at index:', index);
        return;
      }

      // Update form
      const cityForm = branchOfficeGroup.get('city');
      if (cityForm) {
        cityForm.patchValue(
          {
            id: city.id,
            name: city.name,
          },
          { emitEvent: false },
        );
      }

      // Update current customer state
      const currentCustomer = this.customerService.currentItem();
      if (currentCustomer?.branchOfficeList?.[index]) {
        const updatedCustomer = {
          ...currentCustomer,
          branchOfficeList: [...currentCustomer.branchOfficeList],
        };
        updatedCustomer.branchOfficeList[index] = {
          ...updatedCustomer.branchOfficeList[index],
          city: city,
        };
        this.customerService.setCurrentItem(updatedCustomer);
      }

      // Update filtered neighborhoods
      this.filteredNeighborhoodList = city.neighborhoodList?.slice() ?? [];
    } catch (error) {
      console.error('Error in onCitySelectionChange:', error);
      this.filteredNeighborhoodList = [];
    }
  }

  private findCityById(id: number): City | undefined {
    return this.cityList.find((city: City) => city.id === id);
  }

  onNeighborhoodSelectionChange($event: MatSelectChange, index: number) {
    const id = $event.value;
    const neighborhood = this.findNeighborhoodById(id);
    if (!neighborhood) return;

    if (neighborhood?.deliveryZone) {
      this.filteredDeliveryZoneList = [neighborhood?.deliveryZone];
      this.branchOffices()?.at(index).get('deliveryZone.id')?.setValue(-1);
      this.branchOffices()?.at(index).get('deliveryZone.name')?.setValue('');
    }

    let neighborhoodForm = this.branchOffices()?.at(index).get('neighborhood');
    neighborhoodForm?.get('id')?.setValue(neighborhood?.id);
    neighborhoodForm?.get('name')?.setValue(neighborhood?.name);
  }

  private findNeighborhoodById(id: number): Neighborhood | undefined {
    return this.neighborhoodList.find(
      (neighborhood: Neighborhood) => neighborhood.id === id,
    );
  }

  onDeliveryZoneSelectionChange($event: MatSelectChange) {
    const id = $event.value;
    const deliveryZone = this.findDeliveryZoneById(id);
    if (!deliveryZone) return;

    let deliveryZoneForm = this.customerForm.get('deliveryZone');
    deliveryZoneForm?.get('id')?.setValue(deliveryZone?.id);
    deliveryZoneForm?.get('name')?.setValue(deliveryZone?.name);
  }

  private findDeliveryZoneById(id: number): DeliveryZone | undefined {
    return this.deliveryZoneList.find(
      (deliveryZone: DeliveryZone) => deliveryZone.id === id,
    );
  }

  onClickReloadAllDeliveryZone() {
    this.filteredDeliveryZoneList = this.deliveryZoneList.slice();
  }

  onSaveForm() {
    if (!this.customerForm.valid) {
      return;
    }

    try {
      this.isSaving = true;
      const customer: Customer = this.getCustomerFromData();

      this.customerService
        .updateCustomer(customer)
        .then((response: Customer) => {
          if (response?.id) {
            this.afterSaveForm(response.id, 'Actualizado');
          } else {
            throw new Error('Invalid response from server');
          }
        })
        .catch((error: Error) => {
          console.error('Error saving customer:', error);
          this.showErrorSave();
        })
        .finally(() => {
          this.isSaving = false;
        });
    } catch (error) {
      console.error('Error preparing customer data:', error);
      this.showErrorSave();
      this.isSaving = false;
    }
  }

  private showErrorSave() {
    this.toastrService.error(
      'Ha ocurrido un error al guardar el cliente',
      'Error',
    );
  }

  // private _showErrorSave() {
  //   const mensaje = 'No se pudo guardar la orden, intente nuevamente';
  //   this.toastrService.error(mensaje, 'Error', {
  //     closeButton: true,
  //     progressBar: true,
  //     timeOut: 5000,
  //   });
  // }

  private getCustomerFromData(): Customer {
    // Get base customer data
    const customer = this.customerService.currentItem(); // Get the signal value

    if (!customer) {
      throw new Error('No customer data available');
    }

    const customerData: Customer = {
      id: customer.id,
      name: this.customerForm.get('customer.name')?.value,
      phone: this.customerForm.get('customer.phone')?.value,
      email: this.customerForm.get('customer.email')?.value,
      documentNumber: this.customerForm.get('customer.documentNumber')?.value,

      // Document Type
      documentType: {
        id: this.customerForm.get('documentType.id')?.value || -1,
        name: this.customerForm.get('documentType.name')?.value || '',
        version: customer.documentType?.version ?? 0,
      },

      // Membership
      membership: {
        id: this.customerForm.get('membership.id')?.value || -1,
        name: this.customerForm.get('membership.name')?.value || '',
        description:
          this.customerForm.get('membership.description')?.value || '',
        version: customer.membership?.version ?? 0,
      },

      // Map branch offices
      branchOfficeList:
        this.branchOffices()?.controls.map((branchOffice) => ({
          id: branchOffice.get('id')?.value,
          customerId: customer.id,
          address: branchOffice.get('address')?.value || '',

          // Branch office relationships
          deliveryZone: {
            id: branchOffice.get('deliveryZone.id')?.value || -1,
            name: branchOffice.get('deliveryZone.name')?.value || '',
          },

          neighborhood: {
            id: branchOffice.get('neighborhood.id')?.value || -1,
            name: branchOffice.get('neighborhood.name')?.value || '',
          },

          city: {
            id: branchOffice.get('city.id')?.value || -1,
            name: branchOffice.get('city.name')?.value || '',
          },

          // Contact person details
          contactPerson: {
            id: branchOffice.get('contactPerson.id')?.value,
            name: branchOffice.get('contactPerson.name')?.value || '',
            mobileNumberPrimary:
              branchOffice.get('contactPerson.mobileNumberPrimary')?.value ||
              '',
            mobileNumberSecondary:
              branchOffice.get('contactPerson.mobileNumberSecondary')?.value ||
              '',
          },
        })) || [],

      // Additional base fields
      createdAt: customer.createdAt,
      updatedAt: customer.updatedAt,
      isDeleted: customer.isDeleted || false,
      hits: customer.hits ?? 0,
      version: customer.version ?? 0,
    };

    // Remove any invalid relationships
    customerData.branchOfficeList = (customerData.branchOfficeList || []).map(
      (office) => {
        if (office.neighborhood?.id === -1) delete office.neighborhood;
        if (office.city?.id === -1) delete office.city;
        if (office.deliveryZone?.id === -1) delete office.deliveryZone;
        return office;
      },
    );

    return customerData;
  }

  private getBranchOfficeListFromData(): Array<BranchOffice> {
    let branchOfficeList: Array<BranchOffice> = [];
    for (let i = 0; i < this.branchOffices()?.length; i++) {
      let branchOffice: BranchOffice = this.getBranchOfficeFromData(
        this.branchOffices().at(i) as FormGroup,
      );
      branchOfficeList.push(branchOffice);
    }

    return branchOfficeList;
  }

  private getBranchOfficeFromData(branchOfficeForm: FormGroup): BranchOffice {
    const currentCustomerValue = this.customerService.currentItem();

    let branchOffice: BranchOffice = {
      id: branchOfficeForm.get('id')?.value,
      customerId: currentCustomerValue?.id,
      address: branchOfficeForm.get('address')?.value,
      deliveryZone: {
        id: branchOfficeForm.get('deliveryZone.id')?.value,
        name: branchOfficeForm.get('deliveryZone.name')?.value,
      },
      contactPerson: this.getContactPersonFromData(
        branchOfficeForm?.get('contactPerson') as FormGroup,
      ),
    };

    if (branchOfficeForm.get('neighborhood.id')?.value != -1) {
      branchOffice.neighborhood = {
        id: branchOfficeForm.get('neighborhood.id')?.value,
        name: branchOfficeForm.get('neighborhood.name')?.value,
      };
    }

    if (branchOfficeForm.get('city.id')?.value != -1) {
      branchOffice.city = {
        id: branchOfficeForm.get('city.id')?.value,
        name: branchOfficeForm.get('city.name')?.value,
      };
    }

    return branchOffice;
  }

  private getContactPersonFromData(
    contactPersonForm: FormGroup,
  ): ContactPerson {
    return {
      id: contactPersonForm.get('id')?.value,
      name: contactPersonForm.get('name')?.value,
      mobileNumberPrimary: contactPersonForm.get('mobileNumberPrimary')?.value,
      mobileNumberSecondary: contactPersonForm.get('mobileNumberSecondary')
        ?.value,
    };
  }

  private afterSaveForm(id: number, action: string) {
    const mensaje = 'Se ha ' + action + ' el cliente: ' + id;
    this.toastrService.success(mensaje, action, {
      closeButton: true,
      progressBar: true,
      timeOut: 3000,
    });

    this.router.navigate(
      [URL_ADMIN, URL_ADMIN_CLIENTS, URL_ADMIN_CLIENTS_MAIN],
      {
        relativeTo: this.route.root,
      },
    );
    this.isSaving = false;
  }

  //// Validators

  isDeliveryZoneInvalid(index: number) {
    const currentCustomerValue = this.customerService.currentItem();

    let deliveryZoneForm = this.branchOffices()?.at(index).get('deliveryZone');
    if (
      currentCustomerValue?.branchOfficeList &&
      currentCustomerValue.branchOfficeList[index]?.deliveryZone?.id == -1
    ) {
      return true;
    }

    if (
      deliveryZoneForm?.get('id')?.invalid ||
      deliveryZoneForm?.get('id')?.value == -1
    ) {
      return true;
    }
    return false;
  }

  isCityInvalid(index: number) {
    const currentCustomerValue = this.customerService.currentItem();

    let cityForm = this.branchOffices()?.at(index).get('city');
    if (
      currentCustomerValue?.branchOfficeList &&
      currentCustomerValue.branchOfficeList[index]?.city?.id == -1
    ) {
      return true;
    }

    if (cityForm?.get('id')?.invalid || cityForm?.get('id')?.value == -1) {
      return true;
    }

    return false;
  }

  isContactNumberPrimaryInvalid(index: number) {
    let contactPersonForm = this.branchOffices()
      ?.at(index)
      .get('contactPerson');
    if (contactPersonForm?.get('mobileNumberPrimary')?.invalid) {
      return true;
    }

    return false;
  }

  isContactNumberSecondaryInvalid(index: number) {
    let contactPersonForm = this.branchOffices()
      ?.at(index)
      .get('contactPerson');
    if (contactPersonForm?.get('mobileNumberSecondary')?.invalid) {
      return true;
    }

    return false;
  }

  isContactNameInvalid(index: number) {
    let contactPersonForm = this.branchOffices()
      ?.at(index)
      .get('contactPerson');
    if (contactPersonForm?.get('name')?.invalid) {
      return true;
    }

    return false;
  }

  onKeyCity(target: EventTarget | null) {
    this.filteredCityList = this.searchCity((target as HTMLInputElement).value);
  }

  onKeyNeighborhood(target: EventTarget | null) {
    this.filteredNeighborhoodList = this.searchNeighborhood(
      (target as HTMLInputElement).value,
    );
  }

  searchCity(value: string) {
    let filter = value.toUpperCase();
    return this.cityList.filter((city) => {
      if (city?.name) {
        return city.name.toUpperCase().startsWith(filter);
      }
      return false;
    });
  }

  searchNeighborhood(value: string) {
    let filter = value.toUpperCase();
    return this.neighborhoodList.filter((neighborhood) => {
      if (neighborhood?.name) {
        return neighborhood.name.toUpperCase().startsWith(filter);
      }
      return false;
    });
  }
}
