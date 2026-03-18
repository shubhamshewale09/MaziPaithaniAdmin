import React, { useState } from 'react';
import { Phone, Mail } from 'lucide-react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/auth/AuthContext';
import { AuthLogin } from '../../services/auth/Login';
import { showApiError } from '../../Utils/Utils';
import { toast } from 'react-toastify';
import MetaTitle from '../../components/custom/MetaTitle';

const PAITHANI_VIDEO_URL =
  'https://res.cloudinary.com/deot3irfg/video/upload/v1773764259/pathaniWaving_xscbbj.mp4';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [form, setForm] = useState({
    loginId: '',
    password: '',
  });

  const [errors, setErrors] = useState({
    loginId: '',
    password: '',
  });

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm({ ...form, [name]: value });
    setErrors({ ...errors, [name]: '' });
  };

  // Submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    let hasError = false;
    const newErrors = { loginId: '', password: '' };

    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.loginId);

    if (!form.loginId) {
      newErrors.loginId = 'Email is required';
      hasError = true;
    } else if (!isEmail) {
      newErrors.loginId = 'Enter valid email';
      hasError = true;
    }

    if (!form.password) {
      newErrors.password = 'Password is required';
      hasError = true;
    }

    setErrors(newErrors);
    if (hasError) return;

    try {
      setLoading(true);

      const payload = {
        EmailOrPhone: form.loginId,
        password: form.password,
      };

      const res = await AuthLogin(payload);
      console.log('login details', res);
      console.log('LOGIN RESPONSE:', res);

      if (res && res.token) {
        localStorage.setItem('login', JSON.stringify(res));

        login(res);

        toast.success('Login successful 🎉');

        navigate('/dashboard');
      } else {
        showApiError(res);
      }
    } catch (error) {
      console.log('error==>>', error);
      showApiError(error.response?.data || { message: 'Something went wrong' });
    } finally {
      setLoading(false);
    }
  };

  const isEmailInput = form.loginId.includes('@');

  return (
    <>
      <MetaTitle title='Login' />

      <div className='min-h-screen flex items-center justify-center bg-gradient-to-br from-[#fdf6f3] via-[#fafafa] to-[#f3f4f6] p-4'>
        <div className='relative w-full max-w-6xl bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row min-h-[600px]'>
          {/* LEFT SIDE */}
          <div className='w-full md:basis-[45%] p-6 sm:p-10 md:p-14 flex flex-col bg-white'>
            <div className='flex-1 flex flex-col justify-center'>
              <h1 className='text-3xl sm:text-4xl font-extrabold text-[#7a1e2c]'>
                माझी पैठणी
              </h1>

              <p className='mt-3 text-sm text-gray-500 max-w-md'>
                Secure access to manage registrations, Paithani sari Listing And
                Buying{' '}
                <span className='font-semibold text-[#7a1e2c]'>माझी पैठणी</span>
              </p>

              <div className='mt-6 h-1 w-16 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full'></div>

              <form className='space-y-5 mt-8' onSubmit={handleSubmit}>
                {/* EMAIL */}
                <div className='relative border rounded-xl border-gray-200 focus-within:border-[#7a1e2c]'>
                  <label className='absolute top-2 left-4 text-[10px] text-[#7a1e2c] font-bold uppercase'>
                    Email
                  </label>

                  <input
                    type='text'
                    name='loginId'
                    value={form.loginId}
                    onChange={handleChange}
                    className={`w-full pt-6 pb-2 px-4 rounded-xl text-sm font-semibold outline-none
                    ${
                      errors.loginId
                        ? 'ring-2 ring-red-400'
                        : 'focus:ring-2 focus:ring-[#7a1e2c]/30'
                    }`}
                  />

                  {isEmailInput ? (
                    <Mail className='absolute right-4 top-1/2 -translate-y-1/2 text-[#7a1e2c] w-4 h-4' />
                  ) : (
                    <Phone className='absolute right-4 top-1/2 -translate-y-1/2 text-[#7a1e2c] w-4 h-4' />
                  )}

                  {errors.loginId && (
                    <p className='text-red-500 text-xs mt-1 ml-1'>
                      {errors.loginId}
                    </p>
                  )}
                </div>

                {/* PASSWORD */}
                <div className='relative border rounded-xl border-gray-200 focus-within:border-[#7a1e2c]'>
                  <label className='absolute top-2 left-4 text-[10px] text-[#7a1e2c] font-bold uppercase'>
                    Password
                  </label>

                  <input
                    type={showPassword ? 'text' : 'password'}
                    name='password'
                    value={form.password}
                    onChange={handleChange}
                    className={`w-full pt-6 pb-2 px-4 rounded-xl text-sm font-semibold outline-none
                    ${
                      errors.password
                        ? 'ring-2 ring-red-400'
                        : 'focus:ring-2 focus:ring-[#7a1e2c]/30'
                    }`}
                  />

                  <button
                    type='button'
                    onClick={() => setShowPassword((p) => !p)}
                    className='absolute right-4 top-1/2 -translate-y-1/2'
                  >
                    {showPassword ? (
                      <FaEyeSlash fill='#7a1e2c' />
                    ) : (
                      <FaEye fill='#7a1e2c' />
                    )}
                  </button>

                  {errors.password && (
                    <p className='text-red-500 text-xs mt-1 ml-1'>
                      {errors.password}
                    </p>
                  )}
                </div>

                <div className='pt-6'>
                  <button
                    type='submit'
                    disabled={loading}
                    className='w-full py-3 bg-[#7a1e2c] text-white font-semibold rounded-xl text-sm
                    shadow-lg shadow-[#7a1e2c]/30
                    hover:bg-[#651623]
                    hover:scale-[1.02]
                    active:scale-[0.98]
                    transition-all duration-200'
                  >
                    {loading ? 'Logging in...' : 'Login'}
                  </button>
                </div>
              </form>
            </div>
          </div>

          <div className='w-full md:basis-[55%] relative overflow-hidden h-[260px] md:h-auto'>
            <div className='absolute inset-0 bg-[#7a1e2c]/30 z-10'></div>

            <video
              src={PAITHANI_VIDEO_URL}
              autoPlay
              loop
              muted
              playsInline
              className='absolute inset-0 h-full w-full object-cover'
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
