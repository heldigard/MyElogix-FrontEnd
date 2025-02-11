import { NgForOf } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatOption } from '@angular/material/autocomplete';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatSelect, MatSelectChange } from '@angular/material/select';
import { ToastrService } from 'ngx-toastr';
import { DeliveryZoneService } from '../../../../../../../../../customers/infrastructure/services/delivery-zone.service';
import { NeighborhoodService } from '../../../../../../../../../customers/infrastructure/services/neighborhood.service';
import type { ICellRendererAngularComp } from 'ag-grid-angular';
import type { ICellRendererParams } from 'ag-grid-community';
import type { DeliveryZone } from '../../../../../../../../../customers/domain/models/DeliveryZone';
import type { Neighborhood } from '../../../../../../../../../customers/domain/models/Neighborhood';

@Component({
  selector: 'app-delivery-zone-list-cell-renderer',
  imports: [
    NgForOf,
    MatFormField,
    MatLabel,
    MatOption,
    MatSelect,
    ReactiveFormsModule,
  ],
  templateUrl: './delivery-zone-list-cell-renderer.component.html',
  styleUrl: './delivery-zone-list-cell-renderer.component.scss',
})
export class DeliveryZoneListCellRendererComponent
  implements ICellRendererAngularComp
{
  // Exponer el signal del servicio como getter
  get zoneList(): DeliveryZone[] {
    return this.zoneService.items();
  }
  private readonly zoneService = inject(DeliveryZoneService);
  public zoneForm!: FormGroup;
  private neighborhood!: Neighborhood;
  private readonly neighborService: NeighborhoodService =
    inject(NeighborhoodService);
  private readonly toastrService: ToastrService = inject(ToastrService);

  constructor() {
    this.zoneForm = this.zoneService.getForm();
  }

  agInit(params: ICellRendererParams): void {
    this.neighborhood = params.data;
    this.zoneForm.get('id')?.setValue(this.neighborhood.deliveryZone?.id);
    this.zoneForm.get('name')?.setValue(this.neighborhood.deliveryZone?.name);
  }

  refresh(params: any): boolean {
    return false;
  }

  onDeliveryZoneSelectionChange($event: MatSelectChange) {
    const neighborhoodChanged: Neighborhood = {
      id: this.neighborhood.id,
      name: this.neighborhood.name,
      city: {
        id: this.neighborhood.city?.id,
      },
      deliveryZone: {
        id: $event.value,
      },
    } as Neighborhood;

    this.neighborService
      .update(neighborhoodChanged)
      .then((response: Neighborhood) => {
        this.toastrService.success(response.name, 'Guardado', {
          closeButton: true,
          progressBar: true,
          timeOut: 1500,
        });
      })
      .catch((error) => {
        this.toastrService.error(
          `${neighborhoodChanged.name} ${error}`,
          'NO Guardada',
          {
            closeButton: true,
            progressBar: true,
            timeOut: 1500,
          },
        );
      });
  }
}
