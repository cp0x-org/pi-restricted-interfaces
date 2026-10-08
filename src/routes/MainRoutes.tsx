import { Navigate } from 'react-router-dom';
import MainLayout from 'layout/MainLayout';
import ErrorBoundary from './ErrorBoundary';
import MonitorPage from 'views/monitor/MonitorPage';
import InterfacePage from 'views/monitor/InterfacePage';
import CountryPage from 'views/monitor/CountryPage';
import MethodologyPage from 'views/monitor/MethodologyPage';

// ==============================|| MAIN ROUTING ||============================== //

const MainRoutes = {
  path: '/',
  element: <MainLayout />,
  errorElement: <ErrorBoundary />,
  children: [
    {
      index: true,
      element: <Navigate to="monitor" replace />
    },
    {
      path: '/monitor',
      element: <MonitorPage />
    },
    {
      path: '/monitor/:id',
      element: <InterfacePage />
    },
    {
      path: '/country',
      element: <CountryPage />
    },
    {
      path: '/country/:code',
      element: <CountryPage />
    },
    {
      path: '/methodology',
      element: <MethodologyPage />
    },
    {
      path: '*',
      element: <Navigate to="/monitor" replace />
    }
  ]
};

export default MainRoutes;
