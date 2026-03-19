import React, { useState } from 'react';
import { User } from 'lucide-react';

const Profile = () => {
  const [activeTab, setActiveTab] = useState('shopInfo');

  return (
    <div className="p-6 bg-gray-50 min-h-full">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-1">Seller Profile</h1>
        <p className="text-gray-600">Manage your shop and account information</p>
      </div>

      {/* Profile Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-gradient-to-r from-orange-400 to-purple-600 rounded-full flex items-center justify-center">
            <User size={24} className="text-white" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-800">Rajesh Kumar</h2>
            <p className="text-sm text-gray-600">rajesh.kumar@example.com</p>
            <p className="text-sm text-gray-500">Shop Name: Rajesh Paithani Store</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-2 mb-6">
        <div className="flex gap-1">
          <button
            onClick={() => setActiveTab('shopInfo')}
            className={`flex-1 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
              activeTab === 'shopInfo'
                ? 'bg-orange-500 text-white'
                : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
            }`}
          >
            Shop Info
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
          <button
            onClick={() => setActiveTab('verification')}
            className={`flex-1 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
              activeTab === 'verification'
                ? 'bg-orange-500 text-white'
                : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
            }`}
          >
            Verification
          </button>
        </div>
      </div>

      {/* Form Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-6">Shop Information</h3>
        
        <div className="space-y-4">
          {/* Shop Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Shop Name
            </label>
            <input
              type="text"
              value="Rajesh Paithani Store"
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              readOnly
            />
          </div>

          {/* Shop Address */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Shop Address
            </label>
            <textarea
              rows="3"
              value="123, Main Street, Shivaji Nagar, Mumbai - 400001"
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
              readOnly
            />
          </div>

          {/* City and State in same row */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                City
              </label>
              <input
                type="text"
                value="Mumbai"
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                readOnly
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                State
              </label>
              <input
                type="text"
                value="Maharashtra"
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                readOnly
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
