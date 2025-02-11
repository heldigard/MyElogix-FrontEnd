import type { Product } from '../../../domain/models/Product'

export interface ProductState {
  currentProduct: Product | null;
  isLoading?: boolean;
  error?: string;
}
