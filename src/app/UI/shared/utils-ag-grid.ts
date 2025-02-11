import { ITooltipParams, ValueFormatterParams } from 'ag-grid-community';
import moment from 'moment/moment';
import { EStatus } from '../../delivery-orders/domain/models/EStatus';

export function comparatorDateFilter(
  filterLocalDateAtMidnight: Date,
  cellValue: any,
): 0 | 1 | -1 {
  const cellDate = new Date(cellValue);
  let dateFilter = filterLocalDateAtMidnight.toISOString();

  // In the example application, dates are stored as dd/mm/yyyy
  // We create a Date object for comparison against the filter date
  const datePartsFilterFirst = dateFilter.split('T');
  const datePartsFilter = datePartsFilterFirst[0].split('-');
  const yearFilter = Number(datePartsFilter[0]);
  const monthFilter = Number(datePartsFilter[1]);
  const dayFilter = Number(datePartsFilter[2]);

  const datePartsFirst = cellValue.split('T');
  const dateParts = datePartsFirst[0].split('-');
  const year = Number(dateParts[0]);
  const month = Number(dateParts[1]);
  const day = Number(dateParts[2]);

  //Now that both parameters are Date objects, we can compare
  if (year == yearFilter && month == monthFilter && day == dayFilter) {
    return 0;
  }
  if (cellDate < filterLocalDateAtMidnight) {
    return -1;
  } else if (cellDate > filterLocalDateAtMidnight) {
    return 1;
  }
  return 0;
}
//TODO: Revisar si se puede hacer un solo metodo para los dos

export function dateFormatterDay(params: any): string {
  if (params.value) {
    return moment(params.value).format('DD/MM/YYYY HH:mm:ss');
  }
  return '';
}

export function dateFormatterHour(params: any): string {
  if (params.value) {
    return moment(params.value).format('DD/MM/YYYY HH:mm:ss');
  }
  return '';
}

export function tooltipValueGetter(params: ITooltipParams): any {
  return params.value;
}

export function statusFormatter(params: ValueFormatterParams): string {
  switch (params.value as EStatus) {
    case EStatus.DRAFT: {
      return 'Borrador';
    }
    case EStatus.PENDING: {
      return 'Pendiente';
    }
    case EStatus.PRODUCTION: {
      return 'Produccion';
    }
    case EStatus.FINISHED: {
      return 'Finalizado';
    }
    case EStatus.DELIVERED: {
      return 'Entregado';
    }
    case EStatus.CANCELLED: {
      return 'Anulado';
    }
    case EStatus.EXIST: {
      return 'Existe';
    }
    case EStatus.LOW_STOCK: {
      return 'Poco';
    }
    case EStatus.OUT_OF_STOCK: {
      return 'Agotado';
    }
    case EStatus.NEW: {
      return 'Agotado';
    }
    default: {
      return '';
    }
  }
}
