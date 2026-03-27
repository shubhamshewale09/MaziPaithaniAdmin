import { useState } from 'react';
import { User, MapPin, Heart, Package, LogOut, Edit3, Plus, Star, Trash2 } from 'lucide-react';
import { showApiSuccess } from '../../Utils/Utils';

const TABS = [
  { id: 'details',   label: 'Personal Details', icon: <User size={15} /> },
  { id: 'addresses', label: 'Saved Addresses',  icon: <MapPin size={15} /> },
  { id: 'wishlist',  label: 'Wishlist',          icon: <Heart size={15} /> },
  { id: 'history',   label: 'Order History',     icon: <Package size={15} /> },
];

const WISHLIST = [
  { id: 1, name: 'Peacock Motif Paithani', price: '₹14,500', seller: 'Artisan Ravi',  rating: 4.8 },
  { id: 2, name: 'Bridal Gold Border',     price: '₹28,000', seller: 'Weaver Sunita', rating: 4.9 },
];

const ADDRESSES = [
  { id: 1, label: 'Home',   address: '12, Shivaji Nagar, Pune – 411005', phone: '98765 43210', default: true },
  { id: 2, label: 'Office', address: '45, MG Road, Nashik – 422001',     phone: '91234 56789', default: false },
];

const ORDER_HISTORY = [
  { id: 'MP-2024-001', product: 'Peacock Motif Paithani', price: '₹14,500', status: 'Delivered', date: '10 Jan 2024' },
  { id: 'MP-2024-002', product: 'Bridal Gold Border',     price: '₹28,000', status: 'Shipped',   date: '15 Jan 2024' },
];

const STATUS_COLOR = {
  Delivered: 'bg-emerald-100 text-emerald-700',
  Shipped:   'bg-purple-100 text-purple-700',
  Pending:   'bg-amber-100 text-amber-700',
  Accepted:  'bg-blue-100 text-blue-700',
};

const inputCls = 'w-full rounded-xl border border-[#e9d7cf] bg-white px-4 py-2.5 text-sm text-[#3d1e17] placeholder-[#b8a09a] outline-none focus:border-[#7a1e2c] focus:ring-1 focus:ring-[#7a1e2c] transition';

const Profile = ({ onLogout }) => {
  const [tab, setTab]         = useState('details');
  const [editing, setEditing] = useState(false);
  const [wishlist, setWishlist] = useState(WISHLIST);
  const [form, setForm]       = useState({ name: 'Priya Sharma', email: 'priya@example.com', phone: '98765 43210', city: 'Pune' });

  const set = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  const saveProfile = () => {
    setEditing(false);
    showApiSuccess('Profile updated successfully!');
  };

  return (
    <div>
      {/* Profile header */}
      <div className="relative overflow-hidden rounded-[28px] bg-gradient-to-br from-[#5f1320] via-[#7b1d2a] to-[#24090f] p-6 sm:p-8 text-white shadow-xl mb-6">
        <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-[#c28b1e]/20 blur-3xl" />
        <div className="relative flex items-center gap-5">
          <div className="flex h-16 w-16 items-center justify-center rounded-[22px] bg-gradient-to-br from-[#c28b1e] to-[#e0b44b] text-white text-2xl font-bold shadow-lg">
            {form.name[0]}
          </div>
          <div>
            <p className="text-xl font-bold">{form.name}</p>
            <p className="text-sm text-white/70 mt-0.5">{form.email}</p>
            <p className="text-xs text-[#f5d47c] mt-1 uppercase tracking-wider">Premium Member</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[220px_1fr]">
        {/* Sidebar tabs */}
        <div className="space-y-1">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={[
                'flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition',
                tab === t.id
                  ? 'bg-[#7a1e2c] text-white shadow'
                  : 'text-[#6a4a42] hover:bg-[#fff8f3] hover:text-[#7a1e2c]',
              ].join(' ')}
            >
              {t.icon}{t.label}
            </button>
          ))}
          <button
            onClick={onLogout}
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-red-600 transition hover:bg-red-50 mt-2"
          >
            <LogOut size={15} /> Logout
          </button>
        </div>

        {/* Tab content */}
        <div className="rounded-[22px] border border-[#f0e4de] bg-white p-6 shadow-sm">

          {/* Personal Details */}
          {tab === 'details' && (
            <div>
              <div className="flex items-center justify-between mb-5">
                <p className="font-bold text-[#3d1e17]">Personal Details</p>
                <button
                  onClick={() => editing ? saveProfile() : setEditing(true)}
                  className="flex items-center gap-1.5 rounded-xl border border-[#e9d7cf] px-3 py-1.5 text-xs font-semibold text-[#7a1e2c] transition hover:bg-[#fff8f3]"
                >
                  <Edit3 size={12} /> {editing ? 'Save' : 'Edit'}
                </button>
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {[
                  { label: 'Full Name', key: 'name' },
                  { label: 'Email',     key: 'email' },
                  { label: 'Phone',     key: 'phone' },
                  { label: 'City',      key: 'city' },
                ].map(({ label, key }) => (
                  <div key={key}>
                    <label className="block text-xs font-semibold text-[#9b7b69] mb-1.5">{label}</label>
                    {editing
                      ? <input className={inputCls} value={form[key]} onChange={(e) => set(key, e.target.value)} />
                      : <p className="text-sm font-medium text-[#3d1e17] rounded-xl border border-[#f0e4de] bg-[#fff8f3] px-4 py-2.5">{form[key]}</p>
                    }
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Saved Addresses */}
          {tab === 'addresses' && (
            <div>
              <div className="flex items-center justify-between mb-5">
                <p className="font-bold text-[#3d1e17]">Saved Addresses</p>
                <button className="flex items-center gap-1.5 rounded-xl bg-[#7a1e2c] px-3 py-1.5 text-xs font-semibold text-white transition hover:opacity-90">
                  <Plus size={12} /> Add New
                </button>
              </div>
              <div className="space-y-3">
                {ADDRESSES.map((addr) => (
                  <div key={addr.id} className="rounded-[18px] border border-[#f0e4de] bg-[#fff8f3] p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <span className="rounded-lg bg-[#7a1e2c] px-2 py-0.5 text-[10px] font-bold text-white">{addr.label}</span>
                        {addr.default && <span className="rounded-lg bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-700">Default</span>}
                      </div>
                      <button className="text-[#9b7b69] hover:text-red-500 transition"><Trash2 size={14} /></button>
                    </div>
                    <p className="text-sm text-[#3d1e17] mt-2">{addr.address}</p>
                    <p className="text-xs text-[#9b7b69] mt-1">{addr.phone}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Wishlist */}
          {tab === 'wishlist' && (
            <div>
              <p className="font-bold text-[#3d1e17] mb-5">My Wishlist ({wishlist.length})</p>
              {wishlist.length === 0
                ? <p className="text-sm text-[#9b7b69] text-center py-10">Your wishlist is empty.</p>
                : (
                  <div className="space-y-3">
                    {wishlist.map((item) => (
                      <div key={item.id} className="flex items-center gap-4 rounded-[18px] border border-[#f0e4de] bg-[#fff8f3] p-4">
                        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#fff9f4] to-[#fde8d8] text-3xl">🥻</div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-[#3d1e17] text-sm">{item.name}</p>
                          <p className="text-xs text-[#9b7b69]">{item.seller}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <p className="text-sm font-bold text-[#7a1e2c]">{item.price}</p>
                            <div className="flex items-center gap-0.5 text-[#c28b1e]">
                              <Star size={11} fill="currentColor" />
                              <span className="text-xs font-semibold text-[#3d1e17]">{item.rating}</span>
                            </div>
                          </div>
                        </div>
                        <button
                          onClick={() => setWishlist((p) => p.filter((x) => x.id !== item.id))}
                          className="flex h-8 w-8 items-center justify-center rounded-xl border border-[#fde8d8] bg-white text-red-400 transition hover:bg-red-50"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                )
              }
            </div>
          )}

          {/* Order History */}
          {tab === 'history' && (
            <div>
              <p className="font-bold text-[#3d1e17] mb-5">Order History</p>
              <div className="space-y-3">
                {ORDER_HISTORY.map((o) => (
                  <div key={o.id} className="flex items-center gap-4 rounded-[18px] border border-[#f0e4de] bg-[#fff8f3] p-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#fff9f4] to-[#fde8d8] text-2xl">🥻</div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-[#3d1e17] text-sm truncate">{o.product}</p>
                      <p className="text-xs text-[#9b7b69]">{o.id} · {o.date}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-sm font-bold text-[#7a1e2c]">{o.price}</p>
                      <span className={`mt-1 inline-block rounded-full px-2 py-0.5 text-[10px] font-semibold ${STATUS_COLOR[o.status]}`}>
                        {o.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
