import { Component } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';
import { Neighborhood } from '../../../../../../../../../customers/domain/models/Neighborhood';
import { NgForOf } from '@angular/common';
import { City } from '../../../../../../../../../customers/domain/models/City';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatOption } from '@angular/material/autocomplete';
import { MatSelect } from '@angular/material/select';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
    selector: 'app-neighborhood-list-cell-renderer',
    imports: [
        NgForOf,
        MatFormField,
        MatLabel,
        MatOption,
        MatSelect,
        ReactiveFormsModule,
    ],
    templateUrl: './neighborhood-list-cell-renderer.component.html',
    styleUrl: './neighborhood-list-cell-renderer.component.scss'
})
export class NeighborhoodListCellRendererComponent
  implements ICellRendererAngularComp
{
  public neighborhoodList: Neighborhood[] = [];

  agInit(params: ICellRendererParams): void {
    const city: City = params.data;
    this.neighborhoodList = city.neighborhoodList ? city.neighborhoodList : [];
  }

  refresh(params: any): boolean {
    return false;
  }
}
