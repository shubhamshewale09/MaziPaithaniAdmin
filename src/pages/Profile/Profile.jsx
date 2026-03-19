import React, { useState, useEffect } from 'react';
import { User } from 'lucide-react';
import {
  GetProfile,
  SaveShopInfo,
  SaveBankDetails,
  GetSellerDashboard,
} from '../../services/auth/Profile';
import { showApiError } from '../../Utils/Utils';
import { toast } from 'react-toastify';

const Profile = () => {
  const [activeTab, setActiveTab] = useState('shopInfo');
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [userData, setUserData] = useState(null);
  const [sellerId, setSellerId] = useState(null);

  // Get logged-in user data from localStorage
  const getUserId = () => {
    const userId = localStorage.getItem('UserId');
    return userId || '';
  };

  const getUserName = () => {
    const loginData = JSON.parse(localStorage.getItem('login') || '{}');
    return loginData.name || 'User';
  };

  // Form data state
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

  // Calculate progress based on saved data from backend only
  const calculateProgressFromBackend = (data) => {
    let progress = 0;

    // Check Shop Info (50%)
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

    // Check Bank Details (50%)
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

  // Fetch user-specific data on component mount
  // useEffect(() => {
  //   fetchUserData();
  // }, []);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      const userId = getUserId();
      if (!userId) {
        console.error('No userId found in localStorage');
        return;
      }

      // Fetch user-specific data using Profile API
      const response = await GetProfile(userId);

      if (response && response.data) {
        const data = response.data;
        setUserData(data);

        // Update shop info from backend
        setShopInfo({
          sShopName: data.sShopName || '',
          sShopDescription: data.sShopDescription || '',
          sShopAddress: data.sShopAddress || '',
          sCity: data.sCity || '',
          sState: data.sState || '',
          sPincode: data.sPincode || '',
          sBusinessDescription: data.sBusinessDescription || '',
        });

        // Update bank details from backend
        setBankDetails({
          sAccountHolderName: data.sAccountHolderName || '',
          sAccountNumber: data.sAccountNumber || '',
          sifscCode: data.sifscCode || '',
          sBankName: data.sBankName || '',
        });

        // Calculate progress based on saved data
        setProgress(calculateProgressFromBackend(data));
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
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

  const handleSave = async () => {
    console.log('handleSave called with activeTab:', activeTab);
    try {
      setLoading(true);

      if (activeTab === 'shopInfo') {
        console.log('Processing shop info save...');
        // Send shop info payload to specific API with required fields
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

        console.log('Shop Info Payload being sent:', shopInfoPayload);
        const response = await SaveShopInfo(shopInfoPayload);

        // Show success message using toast
        if (response && response.message) {
          toast.success(response.message);
        }

        // Call dashboard API to get sellerId after successful shop info save
        const dashboardResponse = await GetSellerDashboard(getUserId());
        if (
          dashboardResponse &&
          dashboardResponse.data &&
          dashboardResponse.data.length > 0
        ) {
          const sellerData = dashboardResponse.data[0];
          setSellerId(sellerData.iSellerId);
        }
      } else if (activeTab === 'bankDetails') {
        // Send bank details payload to specific API with sellerId
        const bankDetailsPayload = {
          requestedFor: 2,
          taskid: 1,
          iSellerId: sellerId,
          sAccountHolderName: bankDetails.sAccountHolderName,
          sAccountNumber: bankDetails.sAccountNumber,
          sifscCode: bankDetails.sifscCode,
          sBankName: bankDetails.sBankName,
        };

        console.log('Bank Details Payload being sent:', bankDetailsPayload);
        const response = await SaveBankDetails(bankDetailsPayload);

        // Show success message using toast
        if (response && response.message) {
          toast.success(response.message);
        }
      }

      // Don't fetch data after save - only save
    } catch (error) {
      console.error('Error saving profile data:', error);
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
      <div className='bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6'>
        <div className='flex items-center gap-6'>
          {/* Profile Logo with Progress Ring */}
          <div className='relative'>
            <div className='w-24 h-24 bg-gradient-to-r from-orange-400 to-purple-600 rounded-full flex items-center justify-center'>
              <User size={36} className='text-white' />
            </div>
            {/* Progress Ring around logo */}
            <svg className='absolute inset-0 w-24 h-24 transform -rotate-90'>
              <circle
                cx='48'
                cy='48'
                r='44'
                stroke='#e5e7eb'
                strokeWidth='4'
                fill='none'
              />
              <circle
                cx='48'
                cy='48'
                r='44'
                stroke='#f97316'
                strokeWidth='4'
                fill='none'
                strokeDasharray='276.46'
                strokeDashoffset={276.46 - (progress / 100) * 276.46}
                strokeLinecap='round'
                className='transition-all duration-300 ease-out'
              />
            </svg>
            {/* Progress Text */}
            <div className='absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-center'>
              <span className='text-sm font-bold text-gray-800'>
                {progress}%
              </span>
            </div>
          </div>

          {/* User Info */}
          <div className='flex-1 pt-6'>
            <h2 className='text-lg font-semibold text-gray-800'>
              {getUserName()}
            </h2>
            <p className='text-sm text-gray-600'>rajesh.kumar@example.com</p>
            <p className='text-sm text-gray-500'>
              Shop Name: {shopInfo.sShopName || 'Not set'}
            </p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className='bg-white rounded-xl shadow-sm border border-gray-100 p-2 mb-6'>
        <div className='flex gap-1'>
          <button
            onClick={() => setActiveTab('shopInfo')}
            className={`flex-1 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
              activeTab === 'shopInfo'
                ? 'bg-orange-500 text-white'
                : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
            }`}
          >
            Shop Information
          </button>
          <button
            onClick={() => setActiveTab('bankDetails')}
            className={`flex-1 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
              activeTab === 'bankDetails'
                ? 'bg-orange-500 text-white'
                : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
            }`}
          >
            Bank Details
          </button>
        </div>
      </div>

      {/* Form Section */}
      <div className='bg-white rounded-xl shadow-sm border border-gray-100 p-6'>
        {/* Shop Info Tab */}
        {activeTab === 'shopInfo' && (
          <>
            <h3 className='text-lg font-semibold text-gray-800 mb-6'>
              Shop Information
            </h3>
            <div className='space-y-6'>
              {/* Shop Name */}
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  Shop Name
                </label>
                <input
                  type='text'
                  value={shopInfo.sShopName}
                  onChange={(e) =>
                    handleInputChange('shopInfo', 'sShopName', e.target.value)
                  }
                  className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent'
                  placeholder='Enter shop name'
                />
              </div>

              {/* Shop Description */}
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  Shop Description
                </label>
                <textarea
                  rows='4'
                  value={shopInfo.sShopDescription}
                  onChange={(e) =>
                    handleInputChange(
                      'shopInfo',
                      'sShopDescription',
                      e.target.value,
                    )
                  }
                  className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none'
                  placeholder='Enter shop description'
                />
              </div>

              {/* Shop Address */}
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  Shop Address
                </label>
                <textarea
                  rows='3'
                  value={shopInfo.sShopAddress}
                  onChange={(e) =>
                    handleInputChange(
                      'shopInfo',
                      'sShopAddress',
                      e.target.value,
                    )
                  }
                  className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none'
                  placeholder='Enter shop address'
                />
              </div>

              {/* City and State */}
              <div className='grid grid-cols-2 gap-4'>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>
                    City
                  </label>
                  <input
                    type='text'
                    value={shopInfo.sCity}
                    onChange={(e) =>
                      handleInputChange('shopInfo', 'sCity', e.target.value)
                    }
                    className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent'
                    placeholder='Enter city'
                  />
                </div>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>
                    State
                  </label>
                  <input
                    type='text'
                    value={shopInfo.sState}
                    onChange={(e) =>
                      handleInputChange('shopInfo', 'sState', e.target.value)
                    }
                    className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent'
                    placeholder='Enter state'
                  />
                </div>
              </div>

              {/* Pincode */}
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  Pincode
                </label>
                <input
                  type='text'
                  value={shopInfo.sPincode}
                  onChange={(e) =>
                    handleInputChange('shopInfo', 'sPincode', e.target.value)
                  }
                  className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent'
                  placeholder='Enter pincode'
                />
              </div>

              {/* Business Description */}
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  Business Description
                </label>
                <textarea
                  rows='4'
                  value={shopInfo.sBusinessDescription}
                  onChange={(e) =>
                    handleInputChange(
                      'shopInfo',
                      'sBusinessDescription',
                      e.target.value,
                    )
                  }
                  className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none'
                  placeholder='Enter business description'
                />
              </div>
            </div>
          </>
        )}

        {/* Bank Details Tab */}
        {activeTab === 'bankDetails' && (
          <>
            <h3 className='text-lg font-semibold text-gray-800 mb-6'>
              Bank Details
            </h3>
            <div className='space-y-6'>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
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
                  className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent'
                  placeholder='Enter account holder name'
                />
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
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
                  className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent'
                  placeholder='Enter account number'
                />
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
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
                  className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent'
                  placeholder='Enter IFSC code'
                />
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
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
                  className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent'
                  placeholder='Enter bank name'
                />
              </div>
            </div>
          </>
        )}

        {/* Save Button */}
        <div className='mt-8 flex justify-end'>
          <button
            onClick={handleSave}
            disabled={loading}
            className='px-6 py-2.5 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-medium rounded-lg hover:from-orange-600 hover:to-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200'
          >
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
