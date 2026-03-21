import React, { useState, useEffect } from 'react';
import { User } from 'lucide-react';
import {
  GetProfile,
  SaveShopInfo,
  UpdateShopInfo,
  SaveBankDetails,
  UpdateBankDetails,
  GetSellerDashboard,
} from '../../services/auth/Profile';
import { showApiError } from '../../Utils/Utils';
import { toast } from 'react-toastify';
import MetaTitle from '../../components/custom/MetaTitle';

const Profile = () => {
  const [activeTab, setActiveTab] = useState('shopInfo');
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [userData, setUserData] = useState(null);
  const [sellerId, setSellerId] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);

  const getUserId = () => {
    const userId = localStorage.getItem('UserId');
    return userId || '';
  };

  const getUserData = () => {
    const loginData = JSON.parse(localStorage.getItem('login') || '{}');
    const name =
      loginData.name ||
      `${loginData.firstName || loginData.sFirstName || 'User'} ${loginData.lastName || loginData.sLastName || ''}`.trim() ||
      'User';
    const email = loginData.email || 'user@example.com';

    return {
      name,
      email,
    };
  };

  const [shopInfo, setShopInfo] = useState({
    sShopName: '',
    sShopDescription: '',
    sShopAddress: '',
    sCity: '',
    sState: '',
    sPincode: '',
    sBusinessDescription: '',
  });

  const [bankDetails, setBankDetails] = useState({
    sAccountHolderName: '',
    sAccountNumber: '',
    sifscCode: '',
    sBankName: '',
  });

  const calculateProgressFromBackend = (data) => {
    let progress = 0;

    if (
      data.sShopName ||
      data.sShopDescription ||
      data.sShopAddress ||
      data.sCity ||
      data.sState ||
      data.sPincode ||
      data.sBusinessDescription
    ) {
      progress += 50;
    }

    if (
      data.sAccountHolderName ||
      data.sAccountNumber ||
      data.sifscCode ||
      data.sBankName
    ) {
      progress += 50;
    }

    return progress;
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const updateProgressFromDashboard = async () => {
    try {
      const userId = getUserId();
      if (!userId) {
        return null;
      }

      const response = await GetSellerDashboard(userId);

      if (response && response.data && response.data.length > 0) {
        const sellerData = response.data[0];

        if (sellerData.ProfileProgress !== undefined) {
          setProgress(sellerData.ProfileProgress);
        }

        if (sellerData.iSellerId) {
          setSellerId(sellerData.iSellerId);
        }

        setUserData(sellerData);

        setShopInfo({
          sShopName: sellerData.sShopName || '',
          sShopDescription: sellerData.sShopDescription || '',
          sShopAddress: sellerData.sShopAddress || '',
          sCity: sellerData.sCity || '',
          sState: sellerData.sState || '',
          sPincode: sellerData.spincode || '',
          sBusinessDescription: sellerData.sBusinessDescription || '',
        });

        setBankDetails({
          sAccountHolderName: sellerData.SAccountHolderName || '',
          sAccountNumber: sellerData.SAccountNumber || '',
          sifscCode: sellerData.SIFSCCode || '',
          sBankName: sellerData.SBankName || '',
        });

        return response;
      }
      return null;
    } catch (error) {
      return null;
    }
  };

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const userId = getUserId();
      if (!userId) {
        return;
      }

      const response = await GetSellerDashboard(userId);

      if (response && response.data && response.data.length > 0) {
        const sellerData = response.data[0];
        setUserData(sellerData);
        setSellerId(sellerData.iSellerId);

        setShopInfo({
          sShopName: sellerData.sShopName || '',
          sShopDescription: sellerData.sShopDescription || '',
          sShopAddress: sellerData.sShopAddress || '',
          sCity: sellerData.sCity || '',
          sState: sellerData.sState || '',
          sPincode: sellerData.spincode || '',
          sBusinessDescription: sellerData.sBusinessDescription || '',
        });

        setBankDetails({
          sAccountHolderName: sellerData.SAccountHolderName || '',
          sAccountNumber: sellerData.SAccountNumber || '',
          sifscCode: sellerData.SIFSCCode || '',
          sBankName: sellerData.SBankName || '',
        });

        if (sellerData.ProfileProgress !== undefined) {
          setProgress(sellerData.ProfileProgress);

          if (sellerData.ProfileProgress === 100) {
            const loginData = JSON.parse(localStorage.getItem('login') || '{}');
            loginData.isSellerProfileComplete = true;
            localStorage.setItem('login', JSON.stringify(loginData));
          }
        }
      }
    } catch (error) {
      showApiError(
        error.response?.data || {
          message: 'Error fetching profile data. Please try again.',
        },
      );
    } finally {
      setLoading(false);
    }
  };

  const fetchUserData = async () => {
    try {
      setLoading(true);
      const userId = getUserId();
      if (!userId) {
        return;
      }

      const response = await GetProfile(userId);

      if (response && response.data) {
        const data = response.data;
        setUserData(data);

        setShopInfo({
          sShopName: data.sShopName || '',
          sShopDescription: data.sShopDescription || '',
          sShopAddress: data.sShopAddress || '',
          sCity: data.sCity || '',
          sState: data.sState || '',
          sPincode: data.sPincode || '',
          sBusinessDescription: data.sBusinessDescription || '',
        });

        setBankDetails({
          sAccountHolderName: data.sAccountHolderName || '',
          sAccountNumber: data.sAccountNumber || '',
          sifscCode: data.sifscCode || '',
          sBankName: data.sBankName || '',
        });

        setProgress(calculateProgressFromBackend(data));
      }
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (tab, field, value) => {
    switch (tab) {
      case 'shopInfo':
        setShopInfo((prev) => ({ ...prev, [field]: value }));
        break;
      case 'bankDetails':
        setBankDetails((prev) => ({ ...prev, [field]: value }));
        break;
    }
  };

  const isShopInfoComplete = () => {
    if (progress >= 50) {
      return true;
    }

    if (!shopInfo) {
      return false;
    }

    const requiredFields = [
      'sShopName',
      'sShopDescription',
      'sShopAddress',
      'sCity',
      'sState',
      'sPincode',
      'sBusinessDescription',
    ];

    return requiredFields.every((field) => {
      const value = shopInfo[field];
      return value && value.trim() !== '';
    });
  };

  const isBankDetailsTabDisabled = () => {
    if (progress === 100) {
      return false;
    }

    if (isEditMode) {
      return false;
    }

    const shopComplete = isShopInfoComplete();
    const disabled = !shopComplete;

    return disabled;
  };

  const handleTabClick = (tab) => {
    if (progress === 100 && !isEditMode) {
      setIsEditMode(true);
      setActiveTab(tab);

      if (userData) {
        setShopInfo({
          sShopName: userData.sShopName || '',
          sShopDescription: userData.sShopDescription || '',
          sShopAddress: userData.SShopAddress || '',
          sCity: userData.SCity || '',
          sState: userData.SState || '',
          sPincode: userData.SPincode || '',
          sBusinessDescription: userData.SBusinessDescription || '',
        });

        setBankDetails({
          sAccountHolderName: userData.SAccountHolderName || '',
          sAccountNumber: userData.SAccountNumber || '',
          sifscCode: userData.SIFSCCode || '',
          sBankName: userData.SBankName || '',
        });
      }
    } else {
      if (tab === 'bankDetails' && isBankDetailsTabDisabled()) {
        toast.error('Please complete shop information first');
        return;
      }

      setActiveTab(tab);
    }
  };

  const toggleEditMode = () => {
    setIsEditMode(!isEditMode);
    if (!isEditMode) {
      setActiveTab('shopInfo');

      if (userData) {
        setShopInfo({
          sShopName: userData.sShopName || '',
          sShopDescription: userData.sShopDescription || '',
          sShopAddress: userData.SShopAddress || '',
          sCity: userData.SCity || '',
          sState: userData.SState || '',
          sPincode: userData.SPincode || '',
          sBusinessDescription: userData.SBusinessDescription || '',
        });

        setBankDetails({
          sAccountHolderName: userData.SAccountHolderName || '',
          sAccountNumber: userData.SAccountNumber || '',
          sifscCode: userData.SIFSCCode || '',
          sBankName: userData.SBankName || '',
        });
      }
    }
  };

  const handleCancel = () => {
    setIsEditMode(false);
  };

  const handleSave = async () => {
    try {
      setLoading(true);

      if (activeTab === 'shopInfo') {
        if (isEditMode) {
          const updateShopInfoPayload = {
            requestedFor: 1,
            taskid: 2,
            iUserId: parseInt(getUserId()),
            sShopName: shopInfo.sShopName,
            sShopDescription: shopInfo.sShopDescription,
            sShopAddress: shopInfo.sShopAddress,
            sCity: shopInfo.sCity,
            sState: shopInfo.sState,
            spincode: shopInfo.sPincode,
            sBusinessDescription: shopInfo.sBusinessDescription,
            iLocationId: 1,
          };

          const response = await UpdateShopInfo(updateShopInfoPayload);

          if (response && response.message) {
            toast.success(response.message);
          }
        } else {
          const shopInfoPayload = {
            requestedFor: 1,
            taskid: 1,
            iUserId: parseInt(getUserId()),
            iLocationId: 1,
            sShopName: shopInfo.sShopName,
            sShopDescription: shopInfo.sShopDescription,
            sShopAddress: shopInfo.sShopAddress,
            sCity: shopInfo.sCity,
            sState: shopInfo.sState,
            spincode: shopInfo.sPincode,
            sBusinessDescription: shopInfo.sBusinessDescription,
          };

          const response = await SaveShopInfo(shopInfoPayload);

          if (response && response.message) {
            toast.success(response.message);
          }
        }

        const dashboardResponse = await updateProgressFromDashboard();

        if (
          isEditMode &&
          dashboardResponse?.data?.[0]?.ProfileProgress === 100
        ) {
          setIsEditMode(false);

          const loginData = JSON.parse(localStorage.getItem('login') || '{}');
          loginData.isSellerProfileComplete = true;
          localStorage.setItem('login', JSON.stringify(loginData));
        }
      } else if (activeTab === 'bankDetails') {
        if (isEditMode) {
          const updateBankDetailsPayload = {
            RequestedFor: 2,
            TaskID: 2,
            ISellerId: sellerId,
            SAccountHolderName: bankDetails.sAccountHolderName,
            SAccountNumber: bankDetails.sAccountNumber,
            SIFSCCode: bankDetails.sifscCode,
            SBankName: bankDetails.sBankName,
          };

          const response = await UpdateBankDetails(updateBankDetailsPayload);

          if (response && response.message) {
            toast.success(response.message);
          }
        } else {
          const bankDetailsPayload = {
            requestedFor: 2,
            taskid: 1,
            iSellerId: sellerId,
            sAccountHolderName: bankDetails.sAccountHolderName,
            sAccountNumber: bankDetails.sAccountNumber,
            sifscCode: bankDetails.sifscCode,
            sBankName: bankDetails.sBankName,
          };

          const response = await SaveBankDetails(bankDetailsPayload);

          if (response && response.message) {
            toast.success(response.message);
          }
        }

        const dashboardResponse = await updateProgressFromDashboard();

        if (
          isEditMode &&
          dashboardResponse?.data?.[0]?.ProfileProgress === 100
        ) {
          setIsEditMode(false);

          const loginData = JSON.parse(localStorage.getItem('login') || '{}');
          loginData.isSellerProfileComplete = true;
          localStorage.setItem('login', JSON.stringify(loginData));
        }
      }
    } catch (error) {
      showApiError(
        error.response?.data || {
          message: 'Error updating profile. Please try again.',
        },
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <MetaTitle title='Profile' />
      <div className='p-6 bg-gray-50 min-h-full'>
        {/* Page Header */}
        <div className='mb-8'>
          <h1 className='text-2xl font-bold text-gray-800 mb-1'>
            Seller Profile
          </h1>
          <p className='text-gray-600'>
            Manage your shop and account information
          </p>
        </div>

        {/* Profile Card */}
        <div className='bg-gradient-to-br from-[#f8f9fa] to-[#e9ecef] rounded-2xl shadow-lg p-8 mb-8 border border-[#dee2e6]'>
          <div className='flex items-start gap-6'>
            {/* Profile Circle with Progress */}
            <div className='relative'>
              <div className='w-24 h-24 rounded-full bg-gradient-to-br from-[#9b59b6] to-[#e74c3c] flex items-center justify-center text-white text-2xl font-bold shadow-lg'>
                {userData?.sFirstName
                  ? userData.sFirstName.charAt(0).toUpperCase()
                  : 'U'}
              </div>
              {/* Progress Ring */}
              <svg
                className='absolute -top-2 -left-2 w-28 h-28 transform -rotate-90'
                viewBox='0 0 100 100'
              >
                <circle
                  cx='50'
                  cy='50'
                  r='45'
                  stroke='#e5e7eb'
                  strokeWidth='8'
                  fill='none'
                />
                <circle
                  cx='50'
                  cy='50'
                  r='45'
                  stroke={progress === 100 ? '#27ae60' : '#e74c3c'}
                  strokeWidth='8'
                  fill='none'
                  strokeDasharray={`${progress * 2.83} 283`}
                  strokeLinecap='round'
                  className='transition-all duration-500 ease-out'
                />
              </svg>
              <div className='absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-center'>
                <span className='text-sm font-bold text-gray-800 bg-white px-2 py-1 rounded-full shadow-sm'>
                  {progress}%
                </span>
              </div>
            </div>

            {/* User Info */}
            <div className='flex-1 pt-6'>
              <h2 className='text-xl font-bold text-gray-800 mb-1'>
                {userData?.sFirstName && userData?.sLastName
                  ? `${userData.sFirstName} ${userData.sLastName}`
                  : getUserData().name}
              </h2>
              <p className='text-sm text-gray-600 mb-2'>
                {userData?.sEmail || getUserData().email}
              </p>
              {progress === 100 && (
                <div className='inline-flex items-center gap-2 bg-[#e8f5e8] text-[#27ae60] px-3 py-1 rounded-full text-sm font-medium'>
                  <svg
                    className='w-4 h-4'
                    fill='currentColor'
                    viewBox='0 0 20 20'
                  >
                    <path
                      fillRule='evenodd'
                      d='M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z'
                      clipRule='evenodd'
                    />
                  </svg>
                  Profile Complete
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Tabs - Show only when profile is not 100% complete OR when in edit mode */}
        {progress < 100 || isEditMode ? (
          <div className='bg-gradient-to-r from-[#f8f9fa] to-[#e9ecef] rounded-xl shadow-md border border-[#dee2e6] p-2 mb-6'>
            <div className='flex gap-1'>
              <button
                onClick={() => handleTabClick('shopInfo')}
                className={`flex-1 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                  activeTab === 'shopInfo'
                    ? 'bg-gradient-to-r from-[#9b59b6] to-[#e74c3c] text-white shadow-md transform scale-105'
                    : 'text-[#6c757d] hover:text-[#9b59b6] hover:bg-[#f8f9fa]'
                }`}
              >
                <div className='flex items-center justify-center gap-2'>
                  <svg
                    className='w-4 h-4'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth='2'
                      d='M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4'
                    />
                  </svg>
                  Shop Information
                </div>
              </button>
              <button
                onClick={() => handleTabClick('bankDetails')}
                disabled={isBankDetailsTabDisabled()}
                className={`flex-1 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                  activeTab === 'bankDetails'
                    ? 'bg-gradient-to-r from-[#9b59b6] to-[#e74c3c] text-white shadow-md transform scale-105'
                    : isBankDetailsTabDisabled()
                      ? 'text-[#adb5bd] cursor-not-allowed bg-[#f8f9fa]'
                      : 'text-[#6c757d] hover:text-[#9b59b6] hover:bg-[#f8f9fa]'
                }`}
              >
                <div className='flex items-center justify-center gap-2'>
                  <svg
                    className='w-4 h-4'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth='2'
                      d='M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z'
                    />
                  </svg>
                  Bank Details
                  {isBankDetailsTabDisabled() && (
                    <svg
                      className='w-3 h-3 text-[#adb5bd]'
                      fill='none'
                      stroke='currentColor'
                      viewBox='0 0 24 24'
                      title='Complete shop information first'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth='2'
                        d='M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z'
                      />
                    </svg>
                  )}
                </div>
              </button>
            </div>
          </div>
        ) : null}

        {/* Form Section */}
        {progress === 100 && !isEditMode ? (
          <div className='bg-white rounded-xl shadow-sm border border-gray-100 p-6'>
            <div className='flex items-start gap-8 py-8'>
              <div className='flex-1'>
                <div className='bg-green-50 border border-green-200 rounded-lg p-4 mb-6'>
                  <div className='flex items-center gap-3'>
                    <div className='w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0'>
                      <svg
                        className='w-5 h-5 text-green-600'
                        fill='none'
                        stroke='currentColor'
                        viewBox='0 0 24 24'
                      >
                        <path
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          strokeWidth='2'
                          d='M5 13l4 4L19 7'
                        />
                      </svg>
                    </div>
                    <div>
                      <h3 className='text-lg font-semibold text-gray-800'>
                        Profile Complete! 🎉
                      </h3>
                      <p className='text-gray-600 text-sm'>
                        Your profile is 100% complete
                      </p>
                    </div>
                  </div>
                </div>

                <div className='flex justify-end mb-6'>
                  <button
                    onClick={() => {
                      setIsEditMode(true);
                      setActiveTab('shopInfo');
                      if (userData) {
                        setShopInfo({
                          sShopName: userData.sShopName || '',
                          sShopDescription: userData.sShopDescription || '',
                          sShopAddress: userData.SShopAddress || '',
                          sCity: userData.SCity || '',
                          sState: userData.SState || '',
                          sPincode: userData.SPincode || '',
                          sBusinessDescription:
                            userData.SBusinessDescription || '',
                        });

                        setBankDetails({
                          sAccountHolderName: userData.SAccountHolderName || '',
                          sAccountNumber: userData.SAccountNumber || '',
                          sifscCode: userData.SIFSCCode || '',
                          sBankName: userData.SBankName || '',
                        });
                      }
                    }}
                    className='px-6 py-2 bg-gradient-to-r from-[#9b59b6] to-[#e74c3c] text-white rounded-lg shadow-md hover:shadow-lg transition-all duration-200 flex items-center gap-2 text-sm font-medium'
                  >
                    <svg
                      className='w-4 h-4'
                      fill='none'
                      stroke='currentColor'
                      viewBox='0 0 24 24'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth='2'
                        d='M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z'
                      />
                    </svg>
                    Edit Profile
                  </button>
                </div>

                <div className='bg-gray-50 rounded-lg p-6'>
                  <div className='grid grid-cols-2 gap-x-8 gap-y-4'>
                    <div>
                      <span className='text-sm text-gray-500 block mb-1'>
                        Name:
                      </span>
                      <p className='font-medium text-gray-800'>
                        {userData?.sFirstName} {userData?.sLastName}
                      </p>
                    </div>

                    <div>
                      <span className='text-sm text-gray-500 block mb-1'>
                        Email:
                      </span>
                      <p className='font-medium text-gray-800'>
                        {userData?.sEmail}
                      </p>
                    </div>

                    <div>
                      <span className='text-sm text-gray-500 block mb-1'>
                        Phone Number:
                      </span>
                      <p className='font-medium text-gray-800'>
                        {userData?.sPhoneNumber}
                      </p>
                    </div>

                    <div>
                      <span className='text-sm text-gray-500 block mb-1'>
                        Shop Name:
                      </span>
                      <p className='font-medium text-gray-800'>
                        {userData?.sShopName || 'N/A'}
                      </p>
                    </div>

                    <div>
                      <span className='text-sm text-gray-500 block mb-1'>
                        Shop Description:
                      </span>
                      <p className='font-medium text-gray-800'>
                        {userData?.sShopDescription || 'N/A'}
                      </p>
                    </div>

                    <div>
                      <span className='text-sm text-gray-500 block mb-1'>
                        Shop Address:
                      </span>
                      <p className='font-medium text-gray-800'>
                        {userData?.SShopAddress || 'N/A'}
                      </p>
                    </div>

                    <div>
                      <span className='text-sm text-gray-500 block mb-1'>
                        City:
                      </span>
                      <p className='font-medium text-gray-800'>
                        {userData?.SCity || 'N/A'}
                      </p>
                    </div>

                    <div>
                      <span className='text-sm text-gray-500 block mb-1'>
                        State:
                      </span>
                      <p className='font-medium text-gray-800'>
                        {userData?.SState || 'N/A'}
                      </p>
                    </div>

                    <div>
                      <span className='text-sm text-gray-500 block mb-1'>
                        Pincode:
                      </span>
                      <p className='font-medium text-gray-800'>
                        {userData?.SPincode || 'N/A'}
                      </p>
                    </div>

                    <div>
                      <span className='text-sm text-gray-500 block mb-1'>
                        Business Description:
                      </span>
                      <p className='font-medium text-gray-800'>
                        {userData?.SBusinessDescription || 'N/A'}
                      </p>
                    </div>

                    <div>
                      <span className='text-sm text-gray-500 block mb-1'>
                        Account Holder:
                      </span>
                      <p className='font-medium text-gray-800'>
                        {userData?.SAccountHolderName || 'N/A'}
                      </p>
                    </div>

                    <div>
                      <span className='text-sm text-gray-500 block mb-1'>
                        Account Number:
                      </span>
                      <p className='font-medium text-gray-800'>
                        {userData?.SAccountNumber || 'N/A'}
                      </p>
                    </div>

                    <div>
                      <span className='text-sm text-gray-500 block mb-1'>
                        IFSC Code:
                      </span>
                      <p className='font-medium text-gray-800'>
                        {userData?.SIFSCCode || 'N/A'}
                      </p>
                    </div>

                    <div>
                      <span className='text-sm text-gray-500 block mb-1'>
                        Bank Name:
                      </span>
                      <p className='font-medium text-gray-800'>
                        {userData?.SBankName || 'N/A'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className='bg-gradient-to-br from-white to-[#f8f9fa] rounded-xl shadow-md border border-[#dee2e6] p-6'>
            {activeTab === 'shopInfo' && (
              <>
                <div className='mb-6'>
                  <h3 className='text-xl font-bold text-gray-800 mb-2 flex items-center gap-2'>
                    <div className='w-8 h-8 bg-gradient-to-br from-[#9b59b6] to-[#e74c3c] rounded-lg flex items-center justify-center'>
                      <svg
                        className='w-4 h-4 text-white'
                        fill='none'
                        stroke='currentColor'
                        viewBox='0 0 24 24'
                      >
                        <path
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          strokeWidth='2'
                          d='M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4'
                        />
                      </svg>
                    </div>
                    Shop Information
                  </h3>
                  <p className='text-gray-600 text-sm'>
                    Provide details about your shop
                  </p>
                </div>
                <div className='space-y-5'>
                  {/* Shop Name */}
                  <div>
                    <label className='block text-sm font-semibold text-gray-700 mb-2'>
                      Shop Name
                    </label>
                    <input
                      type='text'
                      value={shopInfo.sShopName}
                      onChange={(e) =>
                        handleInputChange(
                          'shopInfo',
                          'sShopName',
                          e.target.value,
                        )
                      }
                      className='w-full px-4 py-3 border border-[#dee2e6] rounded-lg focus:ring-2 focus:ring-[#9b59b6] focus:border-[#9b59b6] transition-all duration-200 bg-white shadow-sm'
                      placeholder='Enter your shop name'
                    />
                  </div>

                  {/* Shop Description */}
                  <div>
                    <label className='block text-sm font-semibold text-gray-700 mb-2'>
                      Shop Description
                    </label>
                    <textarea
                      value={shopInfo.sShopDescription}
                      onChange={(e) =>
                        handleInputChange(
                          'shopInfo',
                          'sShopDescription',
                          e.target.value,
                        )
                      }
                      className='w-full px-4 py-3 border border-[#dee2e6] rounded-lg focus:ring-2 focus:ring-[#9b59b6] focus:border-[#9b59b6] transition-all duration-200 bg-white shadow-sm resize-none'
                      rows='3'
                      placeholder='Describe your shop'
                    />
                  </div>

                  {/* Shop Address */}
                  <div>
                    <label className='block text-sm font-semibold text-gray-700 mb-2'>
                      Shop Address
                    </label>
                    <input
                      type='text'
                      value={shopInfo.sShopAddress}
                      onChange={(e) =>
                        handleInputChange(
                          'shopInfo',
                          'sShopAddress',
                          e.target.value,
                        )
                      }
                      className='w-full px-4 py-3 border border-[#dee2e6] rounded-lg focus:ring-2 focus:ring-[#9b59b6] focus:border-[#9b59b6] transition-all duration-200 bg-white shadow-sm'
                      placeholder='Enter shop address'
                    />
                  </div>

                  {/* City and State */}
                  <div className='grid grid-cols-2 gap-4'>
                    <div>
                      <label className='block text-sm font-semibold text-gray-700 mb-2'>
                        City
                      </label>
                      <input
                        type='text'
                        value={shopInfo.sCity}
                        onChange={(e) =>
                          handleInputChange('shopInfo', 'sCity', e.target.value)
                        }
                        className='w-full px-4 py-3 border border-[#dee2e6] rounded-lg focus:ring-2 focus:ring-[#9b59b6] focus:border-[#9b59b6] transition-all duration-200 bg-white shadow-sm'
                        placeholder='Enter city'
                      />
                    </div>
                    <div>
                      <label className='block text-sm font-semibold text-gray-700 mb-2'>
                        State
                      </label>
                      <input
                        type='text'
                        value={shopInfo.sState}
                        onChange={(e) =>
                          handleInputChange(
                            'shopInfo',
                            'sState',
                            e.target.value,
                          )
                        }
                        className='w-full px-4 py-3 border border-[#dee2e6] rounded-lg focus:ring-2 focus:ring-[#9b59b6] focus:border-[#9b59b6] transition-all duration-200 bg-white shadow-sm'
                        placeholder='Enter state'
                      />
                    </div>
                  </div>

                  {/* Pincode and Business Description */}
                  <div className='space-y-4'>
                    <div>
                      <label className='block text-sm font-semibold text-gray-700 mb-2'>
                        Pincode
                      </label>
                      <input
                        type='text'
                        value={shopInfo.sPincode}
                        onChange={(e) =>
                          handleInputChange(
                            'shopInfo',
                            'sPincode',
                            e.target.value,
                          )
                        }
                        className='w-full px-4 py-3 border border-[#dee2e6] rounded-lg focus:ring-2 focus:ring-[#9b59b6] focus:border-[#9b59b6] transition-all duration-200 bg-white shadow-sm'
                        placeholder='Enter pincode'
                      />
                    </div>
                    <div>
                      <label className='block text-sm font-semibold text-gray-700 mb-2'>
                        Business Description
                      </label>
                      <textarea
                        value={shopInfo.sBusinessDescription}
                        onChange={(e) =>
                          handleInputChange(
                            'shopInfo',
                            'sBusinessDescription',
                            e.target.value,
                          )
                        }
                        className='w-full px-4 py-3 border border-[#dee2e6] rounded-lg focus:ring-2 focus:ring-[#9b59b6] focus:border-[#9b59b6] transition-all duration-200 bg-white shadow-sm resize-none'
                        rows='3'
                        placeholder='Describe your business'
                      />
                    </div>
                  </div>
                </div>
              </>
            )}

            {activeTab === 'bankDetails' && (
              <>
                <div className='mb-6'>
                  <h3 className='text-xl font-bold text-gray-800 mb-2 flex items-center gap-2'>
                    <div className='w-8 h-8 bg-gradient-to-br from-[#e91e63] to-[#f44336] rounded-lg flex items-center justify-center'>
                      <svg
                        className='w-4 h-4 text-white'
                        fill='none'
                        stroke='currentColor'
                        viewBox='0 0 24 24'
                      >
                        <path
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          strokeWidth='2'
                          d='M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z'
                        />
                      </svg>
                    </div>
                    Bank Details
                  </h3>
                  <p className='text-gray-600 text-sm'>
                    Provide your bank account information
                  </p>
                </div>
                <div className='space-y-5'>
                  {/* Account Holder Name */}
                  <div>
                    <label className='block text-sm font-semibold text-gray-700 mb-2'>
                      Account Holder Name
                    </label>
                    <input
                      type='text'
                      value={bankDetails.sAccountHolderName}
                      onChange={(e) =>
                        handleInputChange(
                          'bankDetails',
                          'sAccountHolderName',
                          e.target.value,
                        )
                      }
                      className='w-full px-4 py-3 border border-[#dee2e6] rounded-lg focus:ring-2 focus:ring-[#e91e63] focus:border-[#e91e63] transition-all duration-200 bg-white shadow-sm'
                      placeholder='Enter account holder name'
                    />
                  </div>

                  {/* Account Number */}
                  <div>
                    <label className='block text-sm font-semibold text-gray-700 mb-2'>
                      Account Number
                    </label>
                    <input
                      type='text'
                      value={bankDetails.sAccountNumber}
                      onChange={(e) =>
                        handleInputChange(
                          'bankDetails',
                          'sAccountNumber',
                          e.target.value,
                        )
                      }
                      className='w-full px-4 py-3 border border-[#dee2e6] rounded-lg focus:ring-2 focus:ring-[#e91e63] focus:border-[#e91e63] transition-all duration-200 bg-white shadow-sm'
                      placeholder='Enter account number'
                    />
                  </div>

                  {/* IFSC Code and Bank Name */}
                  <div className='grid grid-cols-2 gap-4'>
                    <div>
                      <label className='block text-sm font-semibold text-gray-700 mb-2'>
                        IFSC Code
                      </label>
                      <input
                        type='text'
                        value={bankDetails.sifscCode}
                        onChange={(e) =>
                          handleInputChange(
                            'bankDetails',
                            'sifscCode',
                            e.target.value,
                          )
                        }
                        className='w-full px-4 py-3 border border-[#dee2e6] rounded-lg focus:ring-2 focus:ring-[#e91e63] focus:border-[#e91e63] transition-all duration-200 bg-white shadow-sm'
                        placeholder='Enter IFSC code'
                      />
                    </div>
                    <div>
                      <label className='block text-sm font-semibold text-gray-700 mb-2'>
                        Bank Name
                      </label>
                      <input
                        type='text'
                        value={bankDetails.sBankName}
                        onChange={(e) =>
                          handleInputChange(
                            'bankDetails',
                            'sBankName',
                            e.target.value,
                          )
                        }
                        className='w-full px-4 py-3 border border-[#dee2e6] rounded-lg focus:ring-2 focus:ring-[#e91e63] focus:border-[#e91e63] transition-all duration-200 bg-white shadow-sm'
                        placeholder='Enter bank name'
                      />
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* Action Buttons */}
            <div className='flex justify-end gap-3 mt-8 pt-6 border-t border-[#dee2e6]'>
              {isEditMode && (
                <button
                  onClick={handleCancel}
                  className='px-6 py-3 border border-[#dee2e6] text-[#6c757d] rounded-lg hover:bg-[#f8f9fa] transition-colors duration-200 font-medium'
                >
                  Cancel
                </button>
              )}
              <button
                onClick={handleSave}
                disabled={loading}
                className='px-6 py-3 bg-gradient-to-r from-[#9b59b6] to-[#e74c3c] text-white rounded-lg hover:from-[#8e44ad] hover:to-[#c0392b] transition-all duration-200 font-medium shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2'
              >
                {loading ? (
                  <>
                    <svg
                      className='animate-spin h-4 w-4'
                      fill='none'
                      viewBox='0 0 24 24'
                    >
                      <circle
                        className='opacity-25'
                        cx='12'
                        cy='12'
                        r='10'
                        stroke='currentColor'
                        strokeWidth='4'
                      />
                      <path
                        className='opacity-75'
                        fill='currentColor'
                        d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
                      />
                    </svg>
                    Saving...
                  </>
                ) : isEditMode ? (
                  'Update Info'
                ) : (
                  'Save Changes'
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Profile;
