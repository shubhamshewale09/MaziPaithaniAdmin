import React, { useState } from "react";
import { User, Mail, Phone } from "lucide-react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import validator from "validator";
import { AuthRegister } from "../../services/auth/Register";
import { showApiError } from "../../Utils/Utils";
import MetaTitle from "../../components/custom/MetaTitle";
import { toast } from "react-toastify";

const initialFormState = {
  sFirstName: "",
  sLastName: "",
  sEmail: "",
  sPhoneNumber: "",
  sPassword: "",
};

const registerValidationSchema = Yup.object({
  sFirstName: Yup.string()
    .required("First name required")
    .matches(/^[A-Za-z]+$/, "First name should not contain spaces or special characters"),
  sLastName: Yup.string()
    .required("Last name required")
    .matches(/^[A-Za-z]+$/, "Last name should not contain spaces or special characters"),
  sEmail: Yup.string()
    .required("Email required")
    .test("is-valid-email", "Invalid email", (value) =>
      value ? validator.isEmail(value) : false
    ),
  sPhoneNumber: Yup.string()
    .required("Phone number required")
    .test("is-valid-mobile", "Enter valid 10 digit mobile number", (value) =>
      value ? validator.isMobilePhone(value, "en-IN", { strictMode: false }) : false
    )
    .test("is-ten-digits", "Enter valid 10 digit mobile number", (value) =>
      value ? /^\d{10}$/.test(value) : false
    ),
  sPassword: Yup.string().required("Password required"),
});

const Register = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const formik = useFormik({
    initialValues: initialFormState,
    validationSchema: registerValidationSchema,
    onSubmit: async (values, { resetForm }) => {
      try {
        setLoading(true);

        const payload = { ...values, roleId: 1 };
        const res = await AuthRegister(payload);
        const responseMessage = (
          res?.message ||
          res?.errorMessage ||
          res?.responseData?.message ||
          ""
        )
          .toString()
          .toLowerCase();

        const isSuccess =
          res?.statusCode === 200 ||
          res?.statusCode === 201 ||
          res?.status === 200 ||
          res?.status === 201 ||
          res?.success === true ||
          res?.isSuccess === true ||
          responseMessage.includes("success") ||
          responseMessage.includes("registered");

        if (isSuccess) {
          resetForm();
          toast.success(res?.message || "Registration successful");
          navigate("/login", { replace: true });
          return;
        }

        showApiError(res);
      } catch (error) {
        console.log(error);
        showApiError(error.response?.data || { message: "Error" });
      } finally {
        setLoading(false);
      }
    },
  });

  const handleNameChange = (e) => {
    const { name, value } = e.target;
    const sanitizedValue = value.replace(/\s/g, "").replace(/[^A-Za-z]/g, "");
    formik.setFieldValue(name, sanitizedValue);
  };

  const handlePhoneChange = (e) => {
    const numericValue = e.target.value.replace(/\D/g, "").slice(0, 10);
    formik.setFieldValue("sPhoneNumber", numericValue);
  };

  const getFieldError = (fieldName) =>
    formik.touched[fieldName] && formik.errors[fieldName]
      ? formik.errors[fieldName]
      : "";

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

          <form
            className="grid md:grid-cols-2 gap-6 mt-10"
            onSubmit={formik.handleSubmit}
          >
            <div className="relative">
              <input
                name="sFirstName"
                value={formik.values.sFirstName}
                onChange={handleNameChange}
                onBlur={formik.handleBlur}
                placeholder="First Name"
                className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-red-300"
              />
              <User className="absolute right-3 top-3 text-gray-400" />
              {getFieldError("sFirstName") && (
                <p className="text-red-500 text-xs">{getFieldError("sFirstName")}</p>
              )}
            </div>

            <div className="relative">
              <input
                name="sLastName"
                value={formik.values.sLastName}
                onChange={handleNameChange}
                onBlur={formik.handleBlur}
                placeholder="Last Name"
                className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-red-300"
              />
              <User className="absolute right-3 top-3 text-gray-400" />
              {getFieldError("sLastName") && (
                <p className="text-red-500 text-xs">{getFieldError("sLastName")}</p>
              )}
            </div>

            <div className="relative">
              <input
                name="sEmail"
                value={formik.values.sEmail}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Email"
                className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-red-300"
              />
              <Mail className="absolute right-3 top-3 text-gray-400" />
              {getFieldError("sEmail") && (
                <p className="text-red-500 text-xs">{getFieldError("sEmail")}</p>
              )}
            </div>

            <div className="relative">
              <input
                name="sPhoneNumber"
                value={formik.values.sPhoneNumber}
                onChange={handlePhoneChange}
                onBlur={formik.handleBlur}
                placeholder="Phone Number"
                className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-red-300"
              />
              <Phone className="absolute right-3 top-3 text-gray-400" />
              {getFieldError("sPhoneNumber") && (
                <p className="text-red-500 text-xs">{getFieldError("sPhoneNumber")}</p>
              )}
            </div>

            <div className="relative md:col-span-2">
              <input
                type={showPassword ? "text" : "password"}
                name="sPassword"
                value={formik.values.sPassword}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
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
              {getFieldError("sPassword") && (
                <p className="text-red-500 text-xs">{getFieldError("sPassword")}</p>
              )}
            </div>

            <div className="md:col-span-2 mt-4">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-[#7a1e2c] text-white font-semibold rounded-xl text-sm
                    shadow-lg shadow-[#7a1e2c]/30
                    hover:bg-[#651623]
                    hover:scale-[1.02]
                    active:scale-[0.98]
                    transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed"
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
