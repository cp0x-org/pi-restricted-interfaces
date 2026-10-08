import { Navigate, useParams } from 'react-router-dom';
import MainLayout from 'layout/MainLayout';
import ErrorBoundary from './ErrorBoundary';
import MonitorPage from 'views/monitor/MonitorPage';
import InterfacePage from 'views/monitor/InterfacePage';
import CountryPage from 'views/monitor/CountryPage';
import MethodologyPage from 'views/monitor/MethodologyPage';
import { SHOW_COUNTRY_PAGE } from 'views/monitor/constants';
import useConfig from 'hooks/useConfig';

// "/" opens the monitor in the remembered language (browsers with a Chinese locale default to Chinese).
function RootRedirect() {
  const { i18n } = useConfig();
  return <Navigate to={i18n === 'zh' ? '/zh/monitor' : '/monitor'} replace />;
}

// While the country page is hidden, /country/XX opens the monitor with that country selected.
function CountryRedirect({ base }: { base: string }) {
  const { code } = useParams<{ code: string }>();
  return <Navigate to={code ? `${base}?country=${code.toUpperCase()}` : base} replace />;
}

// The same pages in every language: English without a prefix, Chinese under /zh (indexable, linked with hreflang).
const pages = (prefix: '' | '/zh') => [
  { path: `${prefix}/monitor`, element: <MonitorPage /> },
  { path: `${prefix}/monitor/:id`, element: <InterfacePage /> },
  { path: `${prefix}/country`, element: SHOW_COUNTRY_PAGE ? <CountryPage /> : <CountryRedirect base={`${prefix}/monitor`} /> },
  { path: `${prefix}/country/:code`, element: SHOW_COUNTRY_PAGE ? <CountryPage /> : <CountryRedirect base={`${prefix}/monitor`} /> },
  { path: `${prefix}/methodology`, element: <MethodologyPage /> }
];

// ==============================|| MAIN ROUTING ||============================== //

const MainRoutes = {
  path: '/',
  element: <MainLayout />,
  errorElement: <ErrorBoundary />,
  children: [
    { index: true, element: <RootRedirect /> },
    ...pages(''),
    { path: '/zh', element: <Navigate to="/zh/monitor" replace /> },
    ...pages('/zh'),
    { path: '/zh/*', element: <Navigate to="/zh/monitor" replace /> },
    { path: '*', element: <Navigate to="/monitor" replace /> }
  ]
};

export default MainRoutes;
