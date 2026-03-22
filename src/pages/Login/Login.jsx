import React, { useRef, useState } from 'react';
import { Mail, Phone } from 'lucide-react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/auth/AuthContext';
import { AuthLogin } from '../../services/auth/Login';
import { showApiError, showApiSuccess } from '../../Utils/Utils';
import MetaTitle from '../../components/custom/MetaTitle';

const PAITHANI_VIDEO_URL =
  'https://res.cloudinary.com/deot3irfg/video/upload/v1773764259/pathaniWaving_xscbbj.mp4';

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const mobileRegex = /^\d{10}$/;
const REMEMBER_CREDENTIALS_KEY = 'rememberedCredentials';

const getRememberedCredentials = () => {
  try {
    const storedValue = localStorage.getItem(REMEMBER_CREDENTIALS_KEY);
    if (!storedValue) {
      return null;
    }

    const parsedValue = JSON.parse(storedValue);
    if (!parsedValue?.loginId || !parsedValue?.password) {
      return null;
    }

    return parsedValue;
  } catch (error) {
    return null;
  }
};

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const rememberedCredentials = getRememberedCredentials();

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberCredentials, setRememberCredentials] = useState(
    !!rememberedCredentials
  );
  const [form, setForm] = useState({
    loginId: rememberedCredentials?.loginId || '',
    password: rememberedCredentials?.password || '',
  });
  const [errors, setErrors] = useState({
    loginId: '',
    password: '',
  });
  const isSubmittingRef = useRef(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const nextValue =
      name === 'loginId' && /^\d*$/.test(value)
        ? value.replace(/\D/g, '').slice(0, 10)
        : value;

    setForm((prev) => ({ ...prev, [name]: nextValue }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleRememberCredentialsChange = (e) => {
    const { checked } = e.target;
    setRememberCredentials(checked);

    if (!checked) {
      localStorage.removeItem(REMEMBER_CREDENTIALS_KEY);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (loading || isSubmittingRef.current) {
      return;
    }

    let hasError = false;
    const newErrors = { loginId: '', password: '' };

    const trimmedLoginId = form.loginId.trim();
    const isEmail = emailRegex.test(trimmedLoginId);
    const isMobile = mobileRegex.test(trimmedLoginId);

    if (!trimmedLoginId) {
      newErrors.loginId = 'Email or mobile number is required';
      hasError = true;
    } else if (!isEmail && !isMobile) {
      newErrors.loginId = 'Enter valid email or 10 digit mobile number';
      hasError = true;
    }

    if (!form.password) {
      newErrors.password = 'Password is required';
      hasError = true;
    }

    setErrors(newErrors);
    if (hasError) {
      showApiError(Object.values(newErrors).find(Boolean));
      return;
    }

    try {
      isSubmittingRef.current = true;
      setLoading(true);

      const payload = {
        EmailOrPhone: trimmedLoginId,
        password: form.password,
      };

      const res = await AuthLogin(payload);

      if (res && res.token) {
        localStorage.setItem('login', JSON.stringify(res));
        localStorage.setItem('token', res.token);

        if (res.userId) {
          localStorage.setItem('UserId', res.userId.toString());
        }
        if (res.roleId) {
          localStorage.setItem('RoleId', res.roleId.toString());
        }

        if (rememberCredentials) {
          localStorage.setItem(
            REMEMBER_CREDENTIALS_KEY,
            JSON.stringify({
              loginId: trimmedLoginId,
              password: form.password,
            })
          );
        } else {
          localStorage.removeItem(REMEMBER_CREDENTIALS_KEY);
        }

        login(res);
        showApiSuccess(res?.message || 'Login successful');

        if (res.isSellerProfileComplete === false) {
          navigate('/dashboard?tab=profile');
        } else {
          navigate('/dashboard');
        }
      } else {
        showApiError(res);
      }
    } catch (error) {
      console.log('error==>>', error);
      showApiError(error.response?.data || { message: 'Something went wrong' });
    } finally {
      isSubmittingRef.current = false;
      setLoading(false);
    }
  };

  const trimmedLoginId = form.loginId.trim();
  const hasValue = trimmedLoginId.length > 0;
  const isMobileInput = /^\d+$/.test(trimmedLoginId);
  const loginLabel = hasValue
    ? isMobileInput
      ? 'Mobile Number'
      : 'Email'
    : 'Email or Mobile Number';
  const LoginIcon = isMobileInput ? Phone : Mail;

  return (
    <>
      <MetaTitle title='Login | Email or Mobile' />

      <div className='min-h-screen flex items-center justify-center bg-gradient-to-br from-[#fdf6f3] via-[#fafafa] to-[#f3f4f6] p-4'>
        <div className='relative w-full max-w-6xl bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row min-h-[600px]'>
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
                <div className='relative border rounded-xl border-gray-200 focus-within:border-[#7a1e2c]'>
                  <label className='absolute top-2 left-4 text-[10px] text-[#7a1e2c] font-bold uppercase'>
                    {loginLabel}
                  </label>

                  <input
                    type='text'
                    name='loginId'
                    value={form.loginId}
                    onChange={handleChange}
                    maxLength={isMobileInput ? 10 : undefined}
                    inputMode={isMobileInput ? 'numeric' : 'email'}
                    className={`w-full pt-6 pb-2 px-4 rounded-xl text-sm font-semibold outline-none ${
                      errors.loginId
                        ? 'ring-2 ring-red-400'
                        : 'focus:ring-2 focus:ring-[#7a1e2c]/30'
                    }`}
                  />

                  <LoginIcon className='absolute right-4 top-1/2 -translate-y-1/2 text-[#7a1e2c] w-4 h-4' />

                  {errors.loginId && (
                    <p className='text-red-500 text-xs mt-1 ml-1'>
                      {errors.loginId}
                    </p>
                  )}
                </div>

                <div className='relative border rounded-xl border-gray-200 focus-within:border-[#7a1e2c]'>
                  <label className='absolute top-2 left-4 text-[10px] text-[#7a1e2c] font-bold uppercase'>
                    Password
                  </label>

                  <input
                    type={showPassword ? 'text' : 'password'}
                    name='password'
                    value={form.password}
                    onChange={handleChange}
                    className={`w-full pt-6 pb-2 px-4 rounded-xl text-sm font-semibold outline-none ${
                      errors.password
                        ? 'ring-2 ring-red-400'
                        : 'focus:ring-2 focus:ring-[#7a1e2c]/30'
                    }`}
                  />

                  <button
                    type='button'
                    onClick={() => setShowPassword((prev) => !prev)}
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

                <label className='flex items-center gap-3 text-sm font-medium text-[#6d5850]'>
                  <input
                    type='checkbox'
                    checked={rememberCredentials}
                    onChange={handleRememberCredentialsChange}
                    className='h-4 w-4 rounded border-gray-300 accent-[#7a1e2c]'
                  />
                  Remember credentials
                </label>

                <div className='pt-2'>
                  <button
                    type='submit'
                    disabled={loading}
                    className='w-full py-3 bg-[#7a1e2c] text-white font-semibold rounded-xl text-sm shadow-lg shadow-[#7a1e2c]/30 hover:bg-[#651623] hover:scale-[1.02] active:scale-[0.98] transition-all duration-200'
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
