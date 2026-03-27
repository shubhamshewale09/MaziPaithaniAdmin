import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import { HelmetProvider } from 'react-helmet-async';

import { AuthProvider } from './context/auth/AuthContext';
import ApiFeedbackModal from './components/custom/ApiFeedbackModal';
import ApiRequestLoader from './components/custom/ApiRequestLoader';
import Loader from './components/custom/Loader';

const LandingPage = lazy(() => import('./pages/LandingPage/LandingPage'));
const Login = lazy(() => import('./pages/Login/Login'));
const Register = lazy(() => import('./pages/Register/Register'));
const Dashboard = lazy(() => import('./pages/Dashboard/Dashboard'));
const CustomerDashboard = lazy(() =>
  import('./CustmerPage/CustomerDashboard/Dashboard'),
);

const getStoredLogin = () => {
  try {
    return JSON.parse(localStorage.getItem('login') || 'null');
  } catch (error) {
    return null;
  }
};

const getDefaultDashboardRoute = () => {
  const loginData = getStoredLogin();
  return Number(loginData?.roleId) === 3 ? '/customer-dashboard' : '/dashboard';
};

const PrivateRoute = ({ children }) => {
  const isAuth = localStorage.getItem('login');
  return isAuth ? children : <Navigate to='/login' replace />;
};

const PublicRoute = ({ children }) => {
  const isAuth = localStorage.getItem('login');
  return !isAuth ? children : <Navigate to={getDefaultDashboardRoute()} replace />;
};

const DashboardRoute = () => {
  const loginData = getStoredLogin();
  return Number(loginData?.roleId) === 3 ? (
    <Navigate to='/customer-dashboard' replace />
  ) : (
    <Dashboard />
  );
};

const CustomerDashboardRoute = () => {
  const loginData = getStoredLogin();
  return Number(loginData?.roleId) === 3 ? (
    <CustomerDashboard />
  ) : (
    <Navigate to='/dashboard' replace />
  );
};

function App() {
  return (
    <AuthProvider>
      <HelmetProvider>
        <BrowserRouter>
          <ApiFeedbackModal />
          <ApiRequestLoader />
          <Suspense fallback={<Loader />}>
            <Routes>
              <Route path='/' element={<LandingPage />} />
              <Route
                path='/login'
                element={
                  <PublicRoute>
                    <Login />
                  </PublicRoute>
                }
              />
              <Route
                path='/register'
                element={
                  <PublicRoute>
                    <Register />
                  </PublicRoute>
                }
              />
              <Route
                path='/dashboard'
                element={
                  <PrivateRoute>
                    <DashboardRoute />
                  </PrivateRoute>
                }
              />
              <Route
                path='/customer-dashboard'
                element={
                  <PrivateRoute>
                    <CustomerDashboardRoute />
                  </PrivateRoute>
                }
              />
              <Route
                path='*'
                element={<Navigate to={getDefaultDashboardRoute()} replace />}
              />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </HelmetProvider>
    </AuthProvider>
  );
}

export default App;
