import React, { useState } from "react";
import { User, Mail, Phone } from "lucide-react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { AuthRegister } from "../../services/auth/Register";
import { showApiError } from "../../Utils/Utils";
import MetaTitle from "../../components/custom/MetaTitle";
import { toast } from "react-toastify"; 

const Register = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [form, setForm] = useState({
    sFirstName: "",
    sLastName: "",
    sEmail: "",
    sPhoneNumber: "",
    sPassword: "",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    setErrors({ ...errors, [name]: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let newErrors = {};

    if (!form.sFirstName) newErrors.sFirstName = "First name required";
    if (!form.sLastName) newErrors.sLastName = "Last name required";

    if (!form.sEmail) {
      newErrors.sEmail = "Email required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.sEmail)) {
      newErrors.sEmail = "Invalid email";
    }

    if (!form.sPhoneNumber) {
      newErrors.sPhoneNumber = "Phone number required";
    } else if (!/^\d{10}$/.test(form.sPhoneNumber)) {
      newErrors.sPhoneNumber = "Enter valid 10 digit number";
    }

    if (!form.sPassword) {
      newErrors.sPassword = "Password required";
    }

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    try {
      setLoading(true);

      const payload = { ...form, roleId: 1 };
      const res = await AuthRegister(payload);

      if (res && (res.statusCode === 200 || res.status === 200)) {
        setForm({
          sFirstName: "",
          sLastName: "",
          sEmail: "",
          sPhoneNumber: "",
          sPassword: "",
        });

        toast.success("Registration successful 🎉");

        navigate("/login"); // redirect to login
      } else {
        showApiError(res);
      }
    } catch (error) {
      console.log(error);
      showApiError(error.response?.data || { message: "Error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <MetaTitle title="Register" />

      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-yellow-50 to-red-50 p-4">
        <div className="w-full max-w-5xl bg-white rounded-3xl shadow-2xl p-8 md:p-12">

          <h1 className="text-3xl md:text-4xl font-bold text-[#C9A227] text-center">
            माझी पैठणी
          </h1>

          <p className="text-center text-gray-500 mt-2">
            Create your account to explore authentic Paithani sarees
          </p>

          <form className="grid md:grid-cols-2 gap-6 mt-10" onSubmit={handleSubmit}>
            {/* First Name */}
            <div className="relative">
              <input
                name="sFirstName"
                value={form.sFirstName}
                onChange={handleChange}
                placeholder="First Name"
                className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-red-300"
              />
              <User className="absolute right-3 top-3 text-gray-400" />
              {errors.sFirstName && <p className="text-red-500 text-xs">{errors.sFirstName}</p>}
            </div>

            {/* Last Name */}
            <div className="relative">
              <input
                name="sLastName"
                value={form.sLastName}
                onChange={handleChange}
                placeholder="Last Name"
                className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-red-300"
              />
              <User className="absolute right-3 top-3 text-gray-400" />
              {errors.sLastName && <p className="text-red-500 text-xs">{errors.sLastName}</p>}
            </div>

            {/* Email */}
            <div className="relative">
              <input
                name="sEmail"
                value={form.sEmail}
                onChange={handleChange}
                placeholder="Email"
                className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-red-300"
              />
              <Mail className="absolute right-3 top-3 text-gray-400" />
              {errors.sEmail && <p className="text-red-500 text-xs">{errors.sEmail}</p>}
            </div>

            {/* Phone */}
            <div className="relative">
              <input
                name="sPhoneNumber"
                value={form.sPhoneNumber}
                onChange={handleChange}
                placeholder="Phone Number"
                className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-red-300"
              />
              <Phone className="absolute right-3 top-3 text-gray-400" />
              {errors.sPhoneNumber && <p className="text-red-500 text-xs">{errors.sPhoneNumber}</p>}
            </div>

            {/* Password */}
            <div className="relative md:col-span-2">
              <input
                type={showPassword ? "text" : "password"}
                name="sPassword"
                value={form.sPassword}
                onChange={handleChange}
                placeholder="Password"
                className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-red-300"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
              {errors.sPassword && <p className="text-red-500 text-xs">{errors.sPassword}</p>}
            </div>

            {/* Button */}
            <div className="md:col-span-2 mt-4">
              <button
                type="submit"
                className="w-full py-3 bg-[#7a1e2c] text-white font-semibold rounded-xl text-sm
                    shadow-lg shadow-[#7a1e2c]/30
                    hover:bg-[#651623]
                    hover:scale-[1.02]
                    active:scale-[0.98]
                    transition-all duration-200"
              >
                {loading ? "Registering..." : "Register"}
              </button>
            </div>
          </form>

          <p className="text-center text-sm mt-6">
            Already have an account?{" "}
            <span
              onClick={() => navigate("/login")}
              className="text-red-700 cursor-pointer font-semibold"
            >
              Login
            </span>
          </p>
        </div>
      </div>
    </>
  );
};

export default Register;