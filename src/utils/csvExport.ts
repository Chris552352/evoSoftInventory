import { Inventory } from '../types/Inventory';
import { Product } from '../types/Product';
import { Store } from '../types/Store';

export const exportToCSV = (
  inventories: Inventory[],
  products: Product[],
  stores: Store[]
): void => {
  // Prepare headers
  const headers = ['Date', 'Product', ...stores.map(store => store.name), 'Total'];

  // Prepare rows
  const rows = inventories.map(inventory => {
    const product = products.find(p => p.id === inventory.productId);
    const stockValues = stores.map(store => inventory.stock[store.id] || 0);
    const total = stockValues.reduce((sum, value) => sum + value, 0);
    
    return [
      new Date(inventory.date).toLocaleDateString(),
      product?.name || 'Unknown Product',
      ...stockValues,
      total
    ];
  });

  // Combine headers and rows
  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.join(','))
  ].join('\n');

  // Create and download the file
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', `inventory_export_${new Date().toISOString().split('T')[0]}.csv`);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
