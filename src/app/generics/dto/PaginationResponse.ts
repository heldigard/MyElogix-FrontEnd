export interface PaginationResponse<T> {
  rows: Array<T>;
  rowCount: number;
  pagesCount: number;
  currentPage: number;
  success: boolean;
  message: string;
}
