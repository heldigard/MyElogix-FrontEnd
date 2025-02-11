export interface DataWrapper<T> {
  item?: T;
  items?: T[];
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: DataWrapper<T>;
}
