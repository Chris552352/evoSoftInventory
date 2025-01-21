import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { InventoryForm } from './components/inventoryForm/InventoryForm';
import { InventoryList } from './components/inventoryList/Inventorylist';
import { LanguageSelector } from './components/languageSelector/LanguageSelector';
import './App.css';

export const App = () => {
  const { t } = useTranslation();

  return (
    <Router>
      <div className="app">
        <nav className="nav-header">
          <div className="nav-brand">{t('welcome')}</div>
          <ul className="nav-links">
            <li>
              <Link to="/">{t('common.inventory_list')}</Link>
            </li>
            <li>
              <Link to="/add">{t('common.add_inventory')}</Link>
            </li>
          </ul>
          <LanguageSelector />
        </nav>

        <main className="main-content">
          <Routes>
            <Route path="/" element={<InventoryList />} />
            <Route path="/add" element={<InventoryForm />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
};
