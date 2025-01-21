export interface Inventory {
  date: string;
  productId: string;
  stock: Record<string, number>;
}