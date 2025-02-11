import { HttpParams } from '@angular/common/http';
import {
  SCREEN_TYPE_CREATE,
  SCREEN_TYPE_EDIT,
  SCREEN_TYPE_VIEW_BILL,
  SCREEN_TYPE_VIEW_PRODUCTION,
} from '@globals';
import type { CellClassParams } from 'ag-grid-community';
import { EStatus } from '../../delivery-orders/domain/models/EStatus';
import { Status } from '../../delivery-orders/domain/models/Status';
import { DeliveryOrder } from '../../delivery_order/domain/model/DeliveryOrder';
import { ProductOrder } from '../../product-order/domain/model/ProductOrder';
import { UserBasic } from '../../users/domain/models/UserBasic';
export function getParamsForPagination(
  queryParams: HttpParams,
  page: number | undefined,
  pageSize: number | undefined,
  sortBy: string | undefined,
  isDeleted: boolean | undefined,
): HttpParams {
  if (page) queryParams = queryParams.append('page', page);
  if (pageSize) queryParams = queryParams.append('pageSize', pageSize);
  if (sortBy) queryParams = queryParams.append('sortBy', sortBy);
  if (isDeleted) queryParams = queryParams.append('isDeleted', isDeleted);

  return queryParams;
}

/**
 * Returns the full name of a user.
 *
 * @param {UserBasic} user - The user object.
 * @return {string} The full name of the user.
 */
export function getFullName(user: UserBasic) {
  return user?.firstName + ' ' + user?.lastName;
}

export function isScreenView(type: string): boolean {
  return type === SCREEN_TYPE_VIEW_PRODUCTION || type === SCREEN_TYPE_VIEW_BILL;
}

export function isScreenEdit(type: string): boolean {
  return type === SCREEN_TYPE_CREATE || type === SCREEN_TYPE_EDIT;
}

export function isEditableStatus(status: Status | undefined): boolean {
  return (
    status?.name === EStatus.PENDING || status?.name === EStatus.PRODUCTION
  );
}
export function isFinishedStatus(
  status: Status | EStatus | undefined,
): boolean {
  if (!status) return false;

  // Check if status is a Status object
  if (typeof status === 'object' && 'name' in status) {
    return (
      status.name === EStatus.FINISHED ||
      status.name === EStatus.CANCELLED ||
      status.name === EStatus.DELIVERED
    );
  }

  // Handle EStatus enum directly
  return (
    status === EStatus.FINISHED ||
    status === EStatus.CANCELLED ||
    status === EStatus.DELIVERED
  );
}

export function isFinishedProductOrder(
  productOrder: ProductOrder,
): boolean | undefined {
  if (productOrder) {
    return (
      productOrder.isFinished ||
      productOrder.isCancelled ||
      productOrder.isDelivered
    );
  }
  return false;
}

export function isDeliveredProductOrder(
  productOrder: ProductOrder,
): boolean | undefined {
  if (productOrder) {
    return productOrder.isCancelled || productOrder.isDelivered;
  }
  return false;
}

export function isFinishedDeliveryOrder(
  deliveryOrder: DeliveryOrder | undefined,
): boolean | undefined {
  if (deliveryOrder) {
    return (
      deliveryOrder.isFinished ||
      deliveryOrder.isCancelled ||
      deliveryOrder.isDelivered
    );
  }
  return false;
}

export function isEditObservation(
  deliveryOrder: DeliveryOrder | undefined,
  type: string,
): boolean | undefined {
  const isEdit = isScreenEdit(type);
  const isView = isScreenView(type);
  const isPending = deliveryOrder?.status?.name === EStatus.PENDING;

  return (
    (isView && !isFinishedDeliveryOrder(deliveryOrder) && !isPending) ||
    (isEdit && !isFinishedDeliveryOrder(deliveryOrder))
  );
}

export function cellStyleStatusProduction(params: CellClassParams): any {
  switch (params.value) {
    case EStatus.PENDING: {
      return {
        background: 'red',
        color: 'white',
      };
    }
    case EStatus.PRODUCTION: {
      return { background: 'yellow', color: 'black' };
    }
    case EStatus.FINISHED: {
      return { background: 'green', color: 'white' };
    }
    case EStatus.CANCELLED: {
      return { background: 'orange', color: 'white' };
    }
    default: {
      return { background: 'transparent', color: 'black' };
    }
  }
}

/**
 * Gets user full name as string
 * @param user User object or id
 * @returns User full name or empty string
 */
export function getUserByAsString(user: UserBasic | undefined): string {
  if (!user) return '';
  if (user instanceof Object && 'firstName' in user && 'lastName' in user) {
    return getFullName(user) + ' (' + (user.username ?? '') + ')';
  }
  return user.username ?? '';
}
