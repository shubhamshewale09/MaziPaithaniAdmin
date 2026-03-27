import { useState } from 'react';
import {
  Edit3,
  Heart,
  LogOut,
  MapPin,
  Package,
  Plus,
  Star,
  Trash2,
  User,
} from 'lucide-react';

import { showApiSuccess } from '../../Utils/Utils';

const TABS = [
  { id: 'details', label: 'Details', icon: User },
  { id: 'addresses', label: 'Addresses', icon: MapPin },
  { id: 'wishlist', label: 'Wishlist', icon: Heart },
  { id: 'history', label: 'Orders', icon: Package },
];

const INITIAL_WISHLIST = [
  { id: 1, name: 'Peacock Motif Paithani', seller: 'Ravi Handlooms', price: 'Rs 14,500', rating: 4.8 },
  { id: 2, name: 'Bridal Gold Border', seller: 'Sunita Weaves', price: 'Rs 28,000', rating: 4.9 },
];

const ADDRESSES = [
  { id: 1, label: 'Home', address: '12 Shivaji Nagar, Pune 411005', phone: '9876543210', default: true },
  { id: 2, label: 'Office', address: '45 MG Road, Nashik 422001', phone: '9123456789', default: false },
];

const ORDER_HISTORY = [
  { id: 'MP-2026-001', product: 'Peacock Motif Paithani', price: 'Rs 14,500', status: 'Delivered', date: '10 Mar 2026' },
  { id: 'MP-2026-002', product: 'Bridal Gold Border', price: 'Rs 28,000', status: 'Shipped', date: '18 Mar 2026' },
];

const STATUS_STYLES = {
  Delivered: 'bg-emerald-100 text-emerald-700',
  Shipped: 'bg-violet-100 text-violet-700',
  Pending: 'bg-amber-100 text-amber-700',
  Accepted: 'bg-blue-100 text-blue-700',
};

const inputClassName =
  'w-full rounded-[18px] border border-[#ead9cf] bg-[#fffaf6] px-4 py-3 text-sm text-[#34160f] outline-none transition focus:border-[#7a1e2c]';

const Profile = ({ onLogout }) => {
  const [activeTab, setActiveTab] = useState('details');
  const [isEditing, setIsEditing] = useState(false);
  const [wishlist, setWishlist] = useState(INITIAL_WISHLIST);
  const [form, setForm] = useState({
    name: 'Priya Sharma',
    email: 'priya@example.com',
    phone: '9876543210',
    city: 'Pune',
  });

  const updateField = (key, value) =>
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));

  const handleSave = () => {
    setIsEditing(false);
    showApiSuccess('Profile updated successfully.');
  };

  return (
    <div className='space-y-6'>
      <section className='rounded-[32px] bg-gradient-to-br from-[#5a1220] via-[#7a1e2c] to-[#2f0c12] p-6 text-white shadow-[0_28px_80px_rgba(66,18,28,0.22)] sm:p-8'>
        <div className='flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between'>
          <div className='flex items-center gap-4'>
            <div className='flex h-16 w-16 items-center justify-center rounded-[24px] bg-[#f5d47c] text-2xl font-bold text-[#5a1220] shadow-lg'>
              {form.name[0]}
            </div>
            <div>
              <p className='text-2xl font-bold'>{form.name}</p>
              <p className='mt-1 text-sm text-white/75'>{form.email}</p>
              <p className='mt-2 text-xs font-semibold uppercase tracking-[0.24em] text-[#f5d47c]'>
                Customer profile
              </p>
            </div>
          </div>

          <button
            type='button'
            onClick={onLogout}
            className='inline-flex items-center justify-center gap-2 rounded-full border border-white/20 bg-white/10 px-5 py-3 text-sm font-semibold text-white'
          >
            <LogOut size={15} />
            Logout
          </button>
        </div>
      </section>

      <div className='flex gap-2 overflow-x-auto pb-1'>
        {TABS.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              type='button'
              onClick={() => setActiveTab(item.id)}
              className={[
                'inline-flex shrink-0 items-center gap-2 rounded-full px-4 py-3 text-sm font-semibold transition',
                isActive
                  ? 'bg-[#7a1e2c] text-white'
                  : 'border border-[#ead9cf] bg-white text-[#6b5048]',
              ].join(' ')}
            >
              <Icon size={15} />
              {item.label}
            </button>
          );
        })}
      </div>

      <section className='rounded-[32px] border border-[#efdcd2] bg-white p-6 shadow-[0_18px_45px_rgba(94,35,23,0.08)]'>
        {activeTab === 'details' ? (
          <div>
            <div className='flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between'>
              <div>
                <p className='text-xs font-semibold uppercase tracking-[0.24em] text-[#a6806f]'>
                  Personal details
                </p>
                <h2 className='mt-2 text-2xl font-bold text-[#34160f]'>Manage your shopper profile</h2>
              </div>
              <button
                type='button'
                onClick={() => (isEditing ? handleSave() : setIsEditing(true))}
                className='inline-flex items-center gap-2 rounded-full border border-[#ead9cf] bg-[#fffaf6] px-4 py-2.5 text-sm font-semibold text-[#7a1e2c]'
              >
                <Edit3 size={14} />
                {isEditing ? 'Save profile' : 'Edit profile'}
              </button>
            </div>

            <div className='mt-6 grid gap-5 md:grid-cols-2'>
              {[
                { key: 'name', label: 'Full name' },
                { key: 'email', label: 'Email address' },
                { key: 'phone', label: 'Phone number' },
                { key: 'city', label: 'City' },
              ].map((item) => (
                <div key={item.key}>
                  <label className='mb-2 block text-sm font-semibold text-[#34160f]'>
                    {item.label}
                  </label>
                  {isEditing ? (
                    <input
                      value={form[item.key]}
                      onChange={(event) => updateField(item.key, event.target.value)}
                      className={inputClassName}
                    />
                  ) : (
                    <div className='rounded-[18px] bg-[#fffaf6] px-4 py-3 text-sm font-semibold text-[#34160f]'>
                      {form[item.key]}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ) : null}

        {activeTab === 'addresses' ? (
          <div>
            <div className='flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between'>
              <div>
                <p className='text-xs font-semibold uppercase tracking-[0.24em] text-[#a6806f]'>
                  Saved addresses
                </p>
                <h2 className='mt-2 text-2xl font-bold text-[#34160f]'>Choose where you want delivery</h2>
              </div>
              <button
                type='button'
                className='inline-flex items-center gap-2 rounded-full bg-[#7a1e2c] px-4 py-2.5 text-sm font-semibold text-white'
              >
                <Plus size={14} />
                Add address
              </button>
            </div>

            <div className='mt-6 grid gap-4'>
              {ADDRESSES.map((address) => (
                <div key={address.id} className='rounded-[24px] bg-[#fffaf6] p-5'>
                  <div className='flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between'>
                    <div>
                      <div className='flex flex-wrap gap-2'>
                        <span className='rounded-full bg-[#7a1e2c] px-3 py-1 text-xs font-semibold text-white'>
                          {address.label}
                        </span>
                        {address.default ? (
                          <span className='rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700'>
                            Default
                          </span>
                        ) : null}
                      </div>
                      <p className='mt-4 text-sm font-semibold text-[#34160f]'>{address.address}</p>
                      <p className='mt-2 text-sm text-[#8b6759]'>{address.phone}</p>
                    </div>

                    <button
                      type='button'
                      className='inline-flex items-center gap-2 rounded-full border border-[#f1d5cf] bg-white px-4 py-2 text-sm font-semibold text-[#c44634]'
                    >
                      <Trash2 size={14} />
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : null}

        {activeTab === 'wishlist' ? (
          <div>
            <p className='text-xs font-semibold uppercase tracking-[0.24em] text-[#a6806f]'>
              Wishlist
            </p>
            <h2 className='mt-2 text-2xl font-bold text-[#34160f]'>Saved favourites</h2>

            {wishlist.length ? (
              <div className='mt-6 grid gap-4'>
                {wishlist.map((item) => (
                  <div key={item.id} className='rounded-[24px] bg-[#fffaf6] p-5'>
                    <div className='flex flex-col gap-4 sm:flex-row sm:items-center'>
                      <div className='flex h-20 w-full items-center justify-center rounded-[22px] bg-gradient-to-br from-[#fff8f1] via-[#fdecd9] to-[#f7d9c6] text-3xl sm:w-20'>
                        S
                      </div>
                      <div className='flex-1'>
                        <p className='text-lg font-bold text-[#34160f]'>{item.name}</p>
                        <p className='mt-1 text-sm text-[#8b6759]'>{item.seller}</p>
                        <div className='mt-3 flex flex-wrap items-center gap-3'>
                          <span className='text-base font-bold text-[#7a1e2c]'>{item.price}</span>
                          <span className='inline-flex items-center gap-1 rounded-full bg-[#fff6db] px-3 py-1 text-xs font-semibold text-[#9b6a08]'>
                            <Star size={12} fill='currentColor' />
                            {item.rating}
                          </span>
                        </div>
                      </div>
                      <button
                        type='button'
                        onClick={() => setWishlist((prev) => prev.filter((entry) => entry.id !== item.id))}
                        className='inline-flex items-center justify-center gap-2 rounded-full border border-[#f1d5cf] bg-white px-4 py-2 text-sm font-semibold text-[#c44634]'
                      >
                        <Trash2 size={14} />
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className='mt-6 text-sm text-[#8b6759]'>Your wishlist is empty.</p>
            )}
          </div>
        ) : null}

        {activeTab === 'history' ? (
          <div>
            <p className='text-xs font-semibold uppercase tracking-[0.24em] text-[#a6806f]'>
              Order history
            </p>
            <h2 className='mt-2 text-2xl font-bold text-[#34160f]'>Recent purchases</h2>

            <div className='mt-6 grid gap-4'>
              {ORDER_HISTORY.map((order) => (
                <div key={order.id} className='rounded-[24px] bg-[#fffaf6] p-5'>
                  <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
                    <div>
                      <p className='text-lg font-bold text-[#34160f]'>{order.product}</p>
                      <p className='mt-1 text-sm text-[#8b6759]'>
                        {order.id} • {order.date}
                      </p>
                    </div>
                    <div className='flex flex-col gap-2 sm:items-end'>
                      <span className='text-base font-bold text-[#7a1e2c]'>{order.price}</span>
                      <span className={`rounded-full px-3 py-1 text-xs font-semibold ${STATUS_STYLES[order.status]}`}>
                        {order.status}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : null}
      </section>
    </div>
  );
};

export default Profile;
