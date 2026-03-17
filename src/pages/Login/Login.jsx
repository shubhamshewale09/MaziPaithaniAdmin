import React from "react";
import { User, Mail, Eye, Phone } from "lucide-react";
import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/auth/AuthContext";
import { AuthLogin } from "../../services/auth/Login";
import { showApiError } from "../../Utils/Utils";
// import pathaniWaving from "../../assets/images/pathaniWaving.mp4";
import MetaTitle from "../../components/custom/MetaTitle";

const PAITHANI_VIDEO_URL = "https://res.cloudinary.com/deot3irfg/video/upload/v1773764259/pathaniWaving_xscbbj.mp4"

const Login = () => {
  const { login } = useAuth();

  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({ mobileNo: "", password: "" });
  const [form, setForm] = useState({
    mobileNo: "",
    password: "",
    loginFrom: "Admin",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "mobileNo" && !/^\d*$/.test(value)) return;
    setForm({ ...form, [name]: value });
    setErrors({ ...errors, [name]: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let hasError = false;
    const newErrors = { mobileNo: "", password: "" };

    if (!form.mobileNo) {
      newErrors.mobileNo = "Mobile number is required";
      hasError = true;
    } else if (!/^\d{10}$/.test(form.mobileNo)) {
      newErrors.mobileNo = "Mobile number must be 10 digits";
      hasError = true;
    }

    if (!form.password) {
      newErrors.password = "Password is required";
      hasError = true;
    }

    setErrors(newErrors);
    if (hasError) return;

    try {
      setLoading(true);
      const res = await AuthLogin(form);
      if (res.statusCode === 200) {
        login(res.responseData.data);
        navigate("/");
      } else {
        showApiError(res);
      }
    } catch (error) {
      console.log("error==>>", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <MetaTitle title="Login" />

      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#fdf6f3] via-[#fafafa] to-[#f3f4f6] p-4">
        <div className="relative w-full max-w-6xl bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row min-h-[600px]">
          {/* Left Side: Form Section */}
          <div className="w-full md:basis-[45%] md:shrink-0 p-6 sm:p-10 md:p-14 flex flex-col z-10 bg-white">
            <nav className="flex items-center space-x-8 mb-10 md:mb-16"></nav>

            <div className="flex-1 flex flex-col justify-center">
              <h1 className="text-3xl sm:text-4xl font-extrabold text-[#7a1e2c] leading-tight">
                माझी पैठणी
              </h1>

              <p className="mt-3 text-sm text-gray-500 max-w-md">
                Secure access to manage registrations, Paithani sari Listing And
                Buying
                <span className="font-semibold text-[#7a1e2c]">
                  {" "}
                  माझी पैठणी
                </span>
                .
              </p>

              <div className="mt-6 h-1 w-16 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full"></div>

              <form className="space-y-5 mt-8" onSubmit={handleSubmit}>
                {/* Mobile */}
                <div className="relative border rounded-xl border-gray-200 focus-within:border-[#7a1e2c] transition">
                  <label className="absolute top-2 left-4 text-[10px] text-[#7a1e2c] font-bold uppercase">
                    Mobile Number
                  </label>

                  <input
                    type="text"
                    name="mobileNo"
                    value={form.mobileNo}
                    onChange={handleChange}
                    maxLength={10}
                    className={`w-full pt-6 pb-2 px-4 rounded-xl text-sm font-semibold outline-none
                    ${errors.mobileNo ? "ring-2 ring-red-400" : "focus:ring-2 focus:ring-[#7a1e2c]/30"}
                    `}
                  />

                  <Phone className="absolute right-4 top-1/2 -translate-y-1/2 text-[#7a1e2c] w-4 h-4" />

                  {errors.mobileNo && (
                    <p className="text-red-500 text-xs mt-1 ml-1">
                      {errors.mobileNo}
                    </p>
                  )}
                </div>

                {/* Password */}
                <div className="relative border rounded-xl border-gray-200 focus-within:border-[#7a1e2c] transition">
                  <label className="absolute top-2 left-4 text-[10px] text-[#7a1e2c] font-bold uppercase">
                    Password
                  </label>

                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    maxLength={6}
                    value={form.password}
                    onChange={handleChange}
                    className={`w-full pt-6 pb-2 px-4 rounded-xl text-sm font-semibold outline-none
                    ${errors.password ? "ring-2 ring-red-400" : "focus:ring-2 focus:ring-[#7a1e2c]/30"}
                    `}
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword((p) => !p)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
                    tabIndex={-1}
                  >
                    {showPassword ? (
                      <FaEyeSlash fill="#7a1e2c" />
                    ) : (
                      <FaEye fill="#7a1e2c" />
                    )}
                  </button>

                  {errors.password && (
                    <p className="text-red-500 text-xs mt-1 ml-1">
                      {errors.password}
                    </p>
                  )}
                </div>

                {/* Button */}
                <div className="flex flex-col sm:flex-row gap-4 pt-6">
                  <button
                    type="submit"
                    className="flex-1 py-3 px-6 bg-[#7a1e2c] text-white font-semibold rounded-xl text-sm 
                              shadow-lg shadow-[#7a1e2c]/30 
                              hover:bg-[#651623] 
                              hover:shadow-xl 
                              hover:scale-[1.02] 
                              active:scale-[0.98] 
                              transition-all duration-200"
                  >
                    {loading ? "Logging in..." : "Login"}
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Right Side Video */}
          <div className="w-full md:basis-[55%] md:shrink-0 relative overflow-hidden h-[260px] md:h-auto">
            {/* Wave Divider */}
            <div className="absolute top-0 left-[-1px] h-full w-16 z-20">
              <svg
                className="h-full w-full"
                viewBox="0 0 100 800"
                preserveAspectRatio="none"
              >
                <path
                  d="M100,0 C40,150 120,350 20,500 C-20,600 80,750 0,800 L0,0 Z"
                  fill="white"
                />
              </svg>
            </div>

            {/* Video Overlay */}
            <div className="absolute inset-0 bg-[#7a1e2c]/30 z-10"></div>

            <video
              src={PAITHANI_VIDEO_URL}
              autoPlay
              loop
              muted
              playsInline
              className="absolute inset-0 h-full w-full object-cover"
            >
              Your browser does not support the video tag.
            </video>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
