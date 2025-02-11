export interface GenericBasicState<T> {
  items: T[];
  rowCount: number;
  pagesCount: number;
  currentPage: number;
  currentItem: T | undefined;
  isLoading: boolean;
  error: string | undefined;
}
