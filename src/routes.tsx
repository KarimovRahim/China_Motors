import { createBrowserRouter } from 'react-router-dom';
import { Layout } from './components/Layout';
import { HomePage } from './pages/HomePage';
import { CatalogPage } from './pages/CatalogPage';
import { CarDetailPage } from './pages/CarDetailPage';
import { ConfiguratorPage } from './pages/ConfiguratorPage';
import { TrackingPage } from './pages/TrackingPage';
import { ComparePage } from './pages/ComparePage';
import { ServicesPage } from './pages/ServicesPage';

export const router = createBrowserRouter([
  {
    path: '/',
    Component: Layout,
    children: [
      { index: true, Component: HomePage },
      { path: 'catalog', Component: CatalogPage },
      { path: 'catalog/:id', Component: CarDetailPage },
      { path: 'configurator', Component: ConfiguratorPage },
      { path: 'tracking', Component: TrackingPage },
      { path: 'compare', Component: ComparePage },
      { path: 'services', Component: ServicesPage },
    ],
  },
]);
