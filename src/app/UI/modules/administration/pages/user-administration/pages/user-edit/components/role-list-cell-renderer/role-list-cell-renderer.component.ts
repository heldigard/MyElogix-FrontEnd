import { Component } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';
import { NgForOf } from '@angular/common';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatOption } from '@angular/material/autocomplete';
import { MatSelect } from '@angular/material/select';
import { ReactiveFormsModule } from '@angular/forms';
import { RoleModel } from '../../../../../../../../../users/domain/models/RoleModel';
import { UserModel } from '../../../../../../../../../users/domain/models/UserModel';

@Component({
    selector: 'app-role-list-cell-renderer',
    imports: [
        NgForOf,
        MatFormField,
        MatLabel,
        MatOption,
        MatSelect,
        ReactiveFormsModule,
    ],
    templateUrl: './role-list-cell-renderer.component.html',
    styleUrl: './role-list-cell-renderer.component.scss'
})
export class RoleListCellRendererComponent implements ICellRendererAngularComp {
  public roleList: RoleModel[] = [];

  agInit(params: ICellRendererParams): void {
    const user: UserModel = params.data;
    this.roleList = user.roles ? user.roles : [];
  }

  refresh(params: any): boolean {
    return false;
  }
}
