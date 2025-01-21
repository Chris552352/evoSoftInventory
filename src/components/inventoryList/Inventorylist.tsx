import React, { useEffect, useState } from 'react';
import { Inventory } from '../../types/Inventory';
import { Product } from '../../types/Product';
import { Store } from '../../types/Store';
import { products } from '../../data/products';
import { stores } from '../../data/stores';
import './InventoryList.css';
import { useTranslation } from 'react-i18next';
import { exportToCSV } from '../../utils/csvExport';

export const InventoryList: React.FC = () => {
  const [inventories, setInventories] = useState<Inventory[]>([]);
  const { t } = useTranslation();

  useEffect(() => {
    try {
      const savedInventories = localStorage.getItem('inventories');
      if (savedInventories) {
        setInventories(JSON.parse(savedInventories));
      }
    } catch (error) {
      console.error('Failed to load inventories:', error);
    }
  }, []);

  const getProductName = (productId: string): string => {
    const product: Product | undefined = products.find((p) => p.id === productId);
    return product ? product.name : 'Unknown Product';
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString();
  };

  const getTotalStock = (stock: Record<string, number>): number => {
    return Object.values(stock).reduce((sum, quantity) => sum + quantity, 0);
  };


  const handleExportCSV = () => {
    exportToCSV(inventories, products, stores);
  };

  if (inventories.length === 0) {
    return (
      <div className="inventory-list empty">
        <h2>{t('common.no_inventory_records')}</h2>
        <p>{t('common.start_by_adding_some_inventory_records')}</p>
      </div>
    );
  }

  return (
    <div className="inventory-list">
      <div className="inventory-header">
        <h2>{t('common.inventory_list')}</h2>
        <button onClick={handleExportCSV} className="export-button">
          {t('common.export_to_csv')}
        </button>
      </div>
      <div className="inventory-table">
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Product</th>
              {stores.map((store: Store) => (
                <th key={store.id}>{store.name}</th>
              ))}
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {inventories.map((inventory: Inventory, index) => (
              <tr key={index}>
                <td>{formatDate(inventory.date)}</td>
                <td>{getProductName(inventory.productId)}</td>
                {stores.map((store: Store) => (
                  <td key={store.id}>{inventory.stock[store.id] || 0}</td>
                ))}
                <td>{getTotalStock(inventory.stock)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};