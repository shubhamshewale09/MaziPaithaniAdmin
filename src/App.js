import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Suspense, lazy } from "react";
import { HelmetProvider } from "react-helmet-async";

import { AuthProvider } from "./context/auth/AuthContext";
import Loader from "./components/custom/Loader";

// Lazy Load Pages
const LandingPage = lazy(() => import("./pages/LandingPage/LandingPage"));
const Login = lazy(() => import("./pages/Login/Login"));
const Register = lazy(() => import("./pages/Register/Register")); 

function App() {
  return (
    <AuthProvider>
      <HelmetProvider>
        <BrowserRouter>
          <Suspense fallback={<Loader />}>
            <Routes>

              {/* Landing Page */}
              <Route path="/" element={<LandingPage />} />

              {/* Login Page */}
              <Route path="/login" element={<Login />} />

              {/* Register Page */}
              <Route path="/register" element={<Register />} /> 

            </Routes>
          </Suspense>
        </BrowserRouter>
      </HelmetProvider>
    </AuthProvider>
  );
}

export default App;