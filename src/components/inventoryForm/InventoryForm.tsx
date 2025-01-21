import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Inventory } from "../../types/Inventory";
import { Product } from "../../types/Product";
import { Store } from "../../types/Store";
import { products } from "../../data/products";
import { stores } from "../../data/stores";
import "./InventoryForm.css";
import { useTranslation } from "react-i18next";

interface FormErrors {
  date?: string;
  productId?: string;
  stock?: string;
}

export const InventoryForm: React.FC = () => {
  const navigate = useNavigate();
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [productId, setProductId] = useState("");
  const [stock, setStock] = useState<Record<string, number>>({});
  const [errors, setErrors] = useState<FormErrors>({});
  const { t } = useTranslation();

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    let isValid = true;

    if (!date) {
      newErrors.date = "Date is required";
      isValid = false;
    }

    if (!productId) {
      newErrors.productId = "Product selection is required";
      isValid = false;
    }

    const hasStockEntries = Object.values(stock).some(value => value > 0);
    if (!hasStockEntries) {
      newErrors.stock = "At least one store must have stock";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const newInventory: Inventory = {
      date,
      productId,
      stock
    };

    const existingInventories: Inventory[] = JSON.parse(
      localStorage.getItem("inventories") || "[]"
    );

    const updatedInventories = [...existingInventories, newInventory];
    localStorage.setItem("inventories", JSON.stringify(updatedInventories));

    navigate("/");
  };

  const handleStockChange = (storeId: string, value: string) => {
    const numValue = value === "" ? 0 : parseInt(value, 10);
    setStock(prev => ({
      ...prev,
      [storeId]: numValue >= 0 ? numValue : 0
    }));
  };

  return (
    <div className="inventory-form">
      <h2>{t("common.add_inventory")}</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="date">Date</label>
          <input
            type="date"
            id="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className={errors.date ? "error" : ""}
          />
          {errors.date && <span className="error-message">{errors.date}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="product">{t('common.product')}</label>
          <select
            id="product"
            value={productId}
            onChange={(e) => setProductId(e.target.value)}
            className={errors.productId ? "error" : ""}
          >
            <option value="">{t('common.select')}</option>
            {products.map((product: Product) => (
              <option key={product.id} value={product.id}>
                {product.name} - {product.price} Fcfa
              </option>
            ))}
          </select>
          {errors.productId && <span className="error-message">{errors.productId}</span>}
        </div>

        <div className="form-group">
          <h3>{t('common.store_stock_levels')}</h3>
          {errors.stock && <span className="error-message">{errors.stock}</span>}
          <div className="store-grid">
            {stores.map((store: Store) => (
              <div key={store.id} className="store-input">
                <label htmlFor={`store-${store.id}`}>{store.name}</label>
                <input
                  type="number"
                  id={`store-${store.id}`}
                  min="0"
                  value={stock[store.id] || ""}
                  onChange={(e) => handleStockChange(store.id, e.target.value)}
                  placeholder="0"
                />
              </div>
            ))}
          </div>
        </div>

        <div className="form-actions">
          <button type="button" onClick={() => navigate("/")} className="button secondary">
          {t("common.cancel")}
          </button>
          <button type="submit" className="button primary">
           {t("common.save")}
          </button>
        </div>
      </form>
    </div>
  );
};