import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Suspense, lazy } from "react";
import { HelmetProvider } from "react-helmet-async";

import { AuthProvider } from "./context/auth/AuthContext";
import ApiFeedbackModal from "./components/custom/ApiFeedbackModal";
import ApiRequestLoader from "./components/custom/ApiRequestLoader";
import Loader from "./components/custom/Loader";

const LandingPage = lazy(() => import("./pages/LandingPage/LandingPage"));
const Login = lazy(() => import("./pages/Login/Login"));
const Register = lazy(() => import("./pages/Register/Register"));
const Dashboard = lazy(() => import("./pages/Dashboard/Dashboard"));
const CustomerDashboard = lazy(() => import("./CustmerPage/CustomerDashboard/Dashboard"));

const PrivateRoute = ({ children }) => {
  const isAuth = localStorage.getItem("login");
  return isAuth ? children : <Navigate to="/login" />;
};

const PublicRoute = ({ children }) => {
  const isAuth = localStorage.getItem("login");
  return !isAuth ? children : <Navigate to="/dashboard" />;
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
              <Route path="/" element={<LandingPage />} />
              <Route
                path="/login"
                element={
                  <PublicRoute>
                    <Login />
                  </PublicRoute>
                }
              />
              <Route
                path="/register"
                element={
                  <PublicRoute>
                    <Register />
                  </PublicRoute>
                }
              />
              <Route
                path="/dashboard"
                element={
                  <PrivateRoute>
                    <Dashboard />
                  </PrivateRoute>
                }
              />
              <Route
                path="/customer-dashboard"
                element={
                  <PrivateRoute>
                    <CustomerDashboard />
                  </PrivateRoute>
                }
              />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </HelmetProvider>
    </AuthProvider>
  );
}

export default App;
