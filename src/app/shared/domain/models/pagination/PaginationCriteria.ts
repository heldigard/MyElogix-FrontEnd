import type { Sort } from './Sort';

export interface PaginationCriteria {
  page: number;
  pageSize: number;
  sortOrders: Sort[];
}
