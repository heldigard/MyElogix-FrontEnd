import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { PaginationResponse } from '../../../../generics/dto/PaginationResponse';
import { PaginationRequest } from '../../../../shared/domain/models/pagination/PaginationRequest';
import { SortOrderDTO } from '../../../../shared/domain/models/pagination/Sort';
import { RoleModelGateway } from '../../../domain/models/gateways/RoleModelGateway';
import { RoleModel } from '../../../domain/models/RoleModel';

@Injectable({
  providedIn: 'root',
})
export class RoleModelGatewayImpl implements RoleModelGateway {
  private apiURL = environment.apiURL + environment.apiVersion;
  private localEndpoint = '/role';

  private httpClient: HttpClient = inject(HttpClient);

  constructor() {}

  add(role: RoleModel): Observable<RoleModel> {
    const endpoint = this.localEndpoint + '/add';

    return this.httpClient.post<RoleModel>(this.apiURL + endpoint, role);
  }

  update(role: RoleModel): Observable<RoleModel> {
    const endpoint = this.localEndpoint + '/update';

    return this.httpClient.put<RoleModel>(this.apiURL + endpoint, role);
  }

  deleteById(id: number): Observable<boolean> {
    const endpoint = this.localEndpoint + '/delete/id';
    let queryParams = new HttpParams();
    queryParams = queryParams.append('id', id);

    return this.httpClient.delete<boolean>(this.apiURL + endpoint, {
      params: queryParams,
    });
  }

  deleteByName(name: string): Observable<boolean> {
    const endpoint = this.localEndpoint + '/delete/name';
    let queryParams = new HttpParams();
    queryParams = queryParams.append('name', name);

    return this.httpClient.delete<boolean>(this.apiURL + endpoint, {
      params: queryParams,
    });
  }

  findById(id: number, isDeleted?: boolean): Observable<RoleModel> {
    const endpoint = this.localEndpoint + '/find/id';
    let queryParams = new HttpParams();
    queryParams = queryParams.append('id', id);
    if (isDeleted) queryParams = queryParams.append('isDeleted', isDeleted);

    return this.httpClient.get<RoleModel>(this.apiURL + endpoint, {
      params: queryParams,
    });
  }

  findByName(name: string, isDeleted?: boolean): Observable<RoleModel> {
    const endpoint = this.localEndpoint + '/find/name';
    let queryParams = new HttpParams();
    queryParams = queryParams.append('name', name);
    if (isDeleted) queryParams = queryParams.append('isDeleted', isDeleted);

    return this.httpClient.get<RoleModel>(this.apiURL + endpoint, {
      params: queryParams,
    });
  }

  findAll(
    sortOrders: SortOrderDTO[],
    isDeleted?: boolean,
  ): Observable<Array<RoleModel>> {
    const endpoint = this.localEndpoint + '/find/all';

    return this.httpClient.post<Array<RoleModel>>(this.apiURL + endpoint, {
      sortOrders: sortOrders,
      isDeleted: isDeleted,
    });
  }

  findAllPagination(
    paginationRequest: PaginationRequest,
  ): Observable<PaginationResponse> {
    const endpoint = this.localEndpoint + '/find/all/pagination';

    return this.httpClient.post<PaginationResponse>(
      this.apiURL + endpoint,
      paginationRequest,
    );
  }

  //
  // downloadExcelFile(): Observable<HttpResponse<Blob>> {
  //   const endpoint = this.localEndpoint + '/excel/download';
  //
  //   return this.httpClient.get<Blob>(this.apiURL + endpoint, {
  //     observe: 'response',
  //     responseType: 'blob' as 'json',
  //   });
  // }
  //
  // uploadExcelFile(file: File): Observable<any> {
  //   const endpoint = this.localEndpoint + '/excel/upload';
  //   const formData = new FormData();
  //   formData.append('file', file, file.name);
  //
  //   return this.httpClient.post<any>(this.apiURL + endpoint, formData, {
  //     reportProgress: true,
  //     responseType: 'json',
  //   });
  // }
}
