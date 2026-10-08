import { Navigate, useParams } from 'react-router-dom';
import MainLayout from 'layout/MainLayout';
import ErrorBoundary from './ErrorBoundary';
import MonitorPage from 'views/monitor/MonitorPage';
import InterfacePage from 'views/monitor/InterfacePage';
import CountryPage from 'views/monitor/CountryPage';
import MethodologyPage from 'views/monitor/MethodologyPage';
import { SHOW_COUNTRY_PAGE } from 'views/monitor/constants';

// While the country page is hidden, /country/XX opens the monitor with that country selected.
function CountryRedirect() {
  const { code } = useParams<{ code: string }>();
  return <Navigate to={code ? `/monitor?country=${code.toUpperCase()}` : '/monitor'} replace />;
}

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
      element: SHOW_COUNTRY_PAGE ? <CountryPage /> : <CountryRedirect />
    },
    {
      path: '/country/:code',
      element: SHOW_COUNTRY_PAGE ? <CountryPage /> : <CountryRedirect />
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
