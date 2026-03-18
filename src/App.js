import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Suspense, lazy } from "react";
import { HelmetProvider } from "react-helmet-async";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { AuthProvider } from "./context/auth/AuthContext";
import Loader from "./components/custom/Loader";

// Lazy Load Pages
const LandingPage = lazy(() => import("./pages/LandingPage/LandingPage"));
const Login = lazy(() => import("./pages/Login/Login"));
const Register = lazy(() => import("./pages/Register/Register"));
const Dashboard = lazy(() => import("./pages/Dashboard/Dashboard"));

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
          
          {/* ✅ Toast Container */}
          <ToastContainer position="top-right" autoClose={3000} />

          <Suspense fallback={<Loader />}>
            <Routes>

              {/* Landing Page */}
              <Route path="/" element={<LandingPage />} />

              {/* Login */}
              <Route
                path="/login"
                element={
                  <PublicRoute>
                    <Login />
                  </PublicRoute>
                }
              />

              {/* Register */}
              <Route
                path="/register"
                element={
                  <PublicRoute>
                    <Register />
                  </PublicRoute>
                }
              />

              {/* Dashboard (Protected) */}
              <Route
                path="/dashboard"
                element={
                  <PrivateRoute>
                    <Dashboard />
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