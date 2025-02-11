import { Component, effect, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { AgGridAngular } from 'ag-grid-angular';
import {
  CellValueChangedEvent,
  ColDef,
  GridApi,
  GridReadyEvent,
  RowModelType,
} from 'ag-grid-community';
import { ToastrService } from 'ngx-toastr';
import { RoleModel } from '../../../../../../../users/domain/models/RoleModel';
import { UserModel } from '../../../../../../../users/domain/models/UserModel';
import { RoleModelService } from '../../../../../../../users/infrastructure/services/role-model.service';
import { UserModelService } from '../../../../../../../users/infrastructure/services/user-model.service';
import { RoleListCellRendererComponent } from './components/role-list-cell-renderer/role-list-cell-renderer.component';

@Component({
  selector: 'app-user-edit',
  imports: [AgGridAngular, FormsModule, MatIcon, MatIconButton],
  templateUrl: './user-edit.component.html',
  styleUrl: './user-edit.component.scss',
})
export class UserEditComponent implements OnInit {
  private gridApi!: GridApi<UserModel>;
  public columnDefs!: ColDef[];
  public defaultColDef: ColDef;

  public overlayLoadingTemplate: string;
  public overlayNoRowsTemplate: string;
  private readonly rowModelType: RowModelType;
  public gridOptions: any;

  public rowData!: UserModel[];
  public roleList!: RoleModel[];
  private readonly userService: UserModelService = inject(UserModelService);
  private readonly roleService: RoleModelService = inject(RoleModelService);
  private readonly toastrService: ToastrService = inject(ToastrService);

  constructor() {
    this.rowData = [];
    this.roleList = [];
    this.columnDefs = this.getColumnsDefs();
    this.rowModelType = 'clientSide';
    this.defaultColDef = {
      flex: 1,
      sortable: true,
      filter: true,
      floatingFilter: true,
      editable: false,
      resizable: true,
    };

    this.overlayLoadingTemplate =
      '<span class="ag-overlay-loading-center">Favor espere mientras consulta los productos</span>';
    this.overlayNoRowsTemplate =
      '<span style="padding: 10px; border: 2px solid #444; background: lightgoldenrodyellow;">No se encontro ningun producto</span>';

    this.gridOptions = {
      rowBuffer: 0,
      maxBlocksInCache: 3,
      rowModelType: this.rowModelType,
      pagination: true,
      paginationAutoPageSize: true,
      animateRows: true,
      groupHeaderHeight: 75,
      headerHeight: 26,
      floatingFiltersHeight: 26,
      pivotGroupHeaderHeight: 50,
      pivotHeaderHeight: 100,
      overlayLoadingTemplate: this.overlayLoadingTemplate,
      overlayNoRowsTemplate: this.overlayNoRowsTemplate,
      suppressScrollOnNewData: true,
    };

    this.getUsersData();
  }

  ngOnInit() {
    this.loadList();
    this.getUsersData();
  }

  // ...existing code...

  loadList() {
    // Create effects to react to signal changes
    effect(() => {
      const userData = this.userService.items();
      if (userData) {
        this.fillRowData(userData);
      }
    });

    effect(() => {
      const roleData = this.roleService.items();
      if (roleData) {
        this.fillRoleData(roleData); // Changed to separate method for role data
      }
    });

    // Initial data fetch if needed
    if (this.userService.items().length === 0) {
      this.userService.fetchAllData();
    }

    if (this.roleService.items().length === 0) {
      this.roleService.fetchAllData();
    }
  }

  private fillRoleData(data: RoleModel[]) {
    this.roleList = data;
  }

  getColumnsDefs(): any {
    return [
      {
        headerName: 'UserName',
        field: 'username',
        minWidth: 120,
        filter: 'agTextColumnFilter', // Use the text filter
        editable: true,
      },
      {
        headerName: 'Password',
        field: 'password',
        minWidth: 120,
        filter: false,
        editable: true,
      },
      {
        headerName: 'Roles',
        field: 'roles',
        minWidth: 120,
        cellRenderer: RoleListCellRendererComponent,
      },
      {
        headerName: 'Nombre',
        field: 'firstName',
        minWidth: 120,
        filter: 'agTextColumnFilter', // Use the text filter
        editable: true,
      },
      {
        headerName: 'Apellido',
        field: 'lastName',
        minWidth: 120,
        filter: 'agTextColumnFilter', // Use the text filter
        editable: true,
      },
      {
        headerName: 'Oficina',
        field: 'office.name',
        minWidth: 120,
        filter: 'agTextColumnFilter', // Use the text filter
        // editable: true,
      },
      // TODO: Deparment
      {
        headerName: 'Email',
        field: 'email',
        minWidth: 120,
        filter: 'agTextColumnFilter', // Use the text filter
        editable: true,
      },
      {
        headerName: 'Telefono',
        field: 'phoneNumber',
        minWidth: 120,
        filter: 'agTextColumnFilter', // Use the text filter
        editable: true,
      },
      {
        headerName: 'ID',
        field: 'id',
        minWidth: 80,
        // maxWidth: 60,
        type: 'numericColumn',
        filter: false,
      },
    ];
  }

  public getUsersData() {
    if (this.gridApi) {
      this.gridApi.setGridOption('loading', true);
    }

    // Obtener datos directamente del signal usando getDataList()
    const currentData = this.userService.items();

    if (currentData.length === 0) {
      // Si no hay datos, hacer fetch
      this.refresh();
    } else {
      this.fillRowData(currentData);
    }
  }

  // Modificar el método refresh para usar el nuevo patrón async/await
  public async refresh() {
    try {
      if (this.gridApi) {
        this.gridApi.setGridOption('loading', true);
      }

      // Usar el nuevo método fetchAllData para actualizar el signal
      await this.userService.fetchAllData();

      // Obtener los datos actualizados del signal
      const data = this.userService.items();
      this.fillRowData(data);
    } catch (error) {
      console.error('Error loading users:', error);
    } finally {
      if (this.gridApi && !this.gridApi.isDestroyed()) {
        this.gridApi.setGridOption('loading', false);
      }
    }
  }

  private fillRowData(data: UserModel[]) {
    this.rowData = data;
    if (this.gridApi && !this.gridApi.isDestroyed()) {
      this.gridApi.setGridOption('loading', false);
    }
  }

  onGridReady(params: GridReadyEvent<UserModel>) {
    this.gridApi = params.api;
    this.gridApi.setGridOption('columnDefs', this.getColumnsDefs());
  }

  onCellValueChanged($event: CellValueChangedEvent<any>) {
    console.log($event.data);
    const userChanged: UserModel = {
      id: $event.data.id,
      username: $event.data.username,
      firstName: $event.data.firstName,
      lastName: $event.data.lastName,
      email: $event.data.email,
      phoneNumber: $event.data.phoneNumber,
      password: $event.data.password,
      isActive: $event.data.isActive,
      isLocked: $event.data.isLocked,
    } as UserModel;

    this.userService
      .update(userChanged)
      .then((response: UserModel) => {
        this.toastrService.success(response.username, 'Guardado', {
          closeButton: true,
          progressBar: true,
          timeOut: 1500,
        });
        this.refresh();
      })
      .catch((error) => {
        this.toastrService.error(
          `${userChanged.username} ${error}`,
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
