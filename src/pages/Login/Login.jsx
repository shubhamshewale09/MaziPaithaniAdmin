import React from 'react';
import { User, Mail, Eye, Phone } from 'lucide-react';
import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/auth/AuthContext";
import { AuthLogin } from "../../services/auth/Login";
import { showApiError } from "../../Utils/Utils";
import kumbhVideo from "../../assets/images/login-page-video.mp4"
import MetaTitle from '../../components/custom/MetaTitle';

const Login = () => {
    const { login } = useAuth();


    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState({ mobileNo: "", password: "" });
    const [form, setForm] = useState({
        mobileNo: "",
        password: "",
        loginFrom: "Admin"
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
            <MetaTitle title="Admin Login" />
            <div className="min-h-screen bg-background flex items-center justify-center p-4">
                {/* Main Card Container */}
                <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-5xl overflow-hidden flex flex-col md:flex-row min-h-[600px] relative">

                    {/* Left Side: Form Section */}
                    <div className="w-full md:basis-[41%] md:shrink-0 p-8 md:p-16 flex flex-col z-10 bg-white">

                        {/* Header/Nav */}
                        <nav className="flex items-center space-x-8 mb-16">
                            {/* display logo here  */}
                        </nav>

                        {/* Form Content */}
                        <div className="flex-1">
                            <h1 className="text-4xl font-extrabold text-gray-900 leading-tight">
                                Kumbh Admin Portal
                            </h1>

                            <p className="mt-3 text-sm text-gray-500 max-w-md">
                                Secure access to manage registrations, events, and devotees during the
                                <span className="font-semibold text-primary"> Kumbh Mela</span>.
                            </p>

                            <div className="mt-6 h-1 w-16 rounded-full "></div>

                            <form className="space-y-4" onSubmit={handleSubmit}>
                                {/* Email */}
                                <div className="relative border-2 rounded-xl">
                                    <label className="absolute top-2 left-4 text-[10px] text-primary font-bold uppercase">
                                        Mobile Number
                                    </label>

                                    <input
                                        type="text"
                                        name="mobileNo"
                                        value={form.mobileNo}
                                        onChange={handleChange}
                                        maxLength={10}
                                        className={`w-full pt-6 pb-2 px-4 rounded-xl text-sm font-semibold outline-none
      ${errors.mobileNo ? "ring-2 ring-red-400" : "focus:ring-2 focus:ring-border"}
    `}
                                    />

                                    <Phone className="absolute right-4 top-1/2 -translate-y-1/2 text-primary w-4 h-4" />

                                    {errors.mobileNo && (
                                        <p className="text-red-500 text-xs mt-1 ml-1">
                                            {errors.mobileNo}
                                        </p>
                                    )}
                                </div>


                                {/* Password */}
                                <div className="relative border-2 rounded-xl">
                                    <label className="absolute top-2 left-4 text-[10px] text-primary font-bold uppercase">
                                        Password
                                    </label>

                                    <input
                                        type={showPassword ? "text" : "password"}
                                        name="password"
                                        maxLength={6}
                                        value={form.password}
                                        onChange={handleChange}
                                        className={`w-full pt-6 pb-2 px-4 rounded-xl text-sm font-semibold outline-none
                                            ${errors.password ? "ring-2 ring-red-400" : "focus:ring-2 focus:ring-border"}
                                              `}
                                    />

                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(p => !p)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
                                        tabIndex={-1}
                                    >
                                        {showPassword ? <FaEyeSlash fill='#8f2a2a' /> : <FaEye fill='#721111' />}
                                    </button>

                                    {errors.password && (
                                        <p className="text-red-500 text-xs mt-1 ml-1">
                                            {errors.password}
                                        </p>
                                    )}
                                </div>


                                {/* Buttons */}
                                <div className="flex flex-col sm:flex-row gap-4 pt-6">

                                    <button type="submit" className="flex-1 py-3 px-6 bg-primary text-white font-bold rounded-full text-sm shadow-lg shadow-red-200 hover:bg-primary-light transition-all transform hover:-translate-y-0.5">
                                        Login
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>

                    {/* Right Side: Image with Wave Mask */}
                    <div className="hidden md:block md:basis-[59%] md:shrink-0 relative overflow-hidden">

                        {/* The Wave Divider (SVG) */}
                        <div className="absolute top-0 left-[-1px] h-full w-16 z-20">
                            <svg className="h-full w-full" viewBox="0 0 100 800" preserveAspectRatio="none">
                                <path
                                    d="M100,0 C40,150 120,350 20,500 C-20,600 80,750 0,800 L0,0 Z"
                                    fill="white"
                                />
                                {/* <path
                                d="M100,0 C40,150 120,350 20,500 C-20,600 80,750 0,800"
                                fill="none"
                                stroke="#E5E7EB"
                                strokeWidth="1"
                                strokeDasharray="4 4"
                            /> */}
                            </svg>
                        </div>

                        {/* Background Image */}
                        {/* <img
                        src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=1000"
                        alt="Mountains"
                        className="absolute inset-0 h-full w-full object-cover"
                    /> */}
                        <video
                            src={kumbhVideo}
                            autoPlay
                            loop
                            muted
                            playsInline
                            className="absolute inset-0 h-full w-full object-cover pointer-events-none"
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

