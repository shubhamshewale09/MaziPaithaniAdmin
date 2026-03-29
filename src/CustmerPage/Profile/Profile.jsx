import { useEffect, useState } from 'react';
import {
  Edit3, LogOut, MapPin, Plus, Trash2,
  User, Mail, Phone, CheckCircle2, Home, Briefcase, Save, X,
} from 'lucide-react';
import { showApiSuccess, showApiError } from '../../Utils/Utils';
import { updateCustomerProfile, addAddress, updateCustomerAddress, getCustomerAddresses, deleteAddress } from '../../ServiceCustmer/Profile/ProfileApi';

const TABS = [
  { id: 'details',   label: 'My Details', icon: User   },
  { id: 'addresses', label: 'Addresses',  icon: MapPin },
];

const inputCls =
  'w-full rounded-2xl border border-[#ead9cf] bg-white px-4 py-3 text-sm text-[#34160f] outline-none transition focus:border-[#7a1e2c] focus:ring-2 focus:ring-[#7a1e2c]/10 placeholder:text-[#c4a99e]';

const getLoginInfo = () => {
  try { return JSON.parse(localStorage.getItem('login') || '{}'); }
  catch { return {}; }
};

const mapApiAddresses = (list, phone) =>
  [...list]
    .sort((a, b) => (b.isDefault ? 1 : 0) - (a.isDefault ? 1 : 0))
    .map((a) => ({
      id:        a.addressId,
      addressId: a.addressId,
      label:     a.addressType || 'Address',
      icon:      a.addressType?.toLowerCase() === 'home' ? Home : Briefcase,
      address:   [a.addressLine1, a.addressLine2, a.city, a.state, a.postalCode, a.country].filter(Boolean).join(', '),
      phone,
      default:   a.isDefault,
      rawFields: {
        addressLine1: a.addressLine1 || '',
        addressLine2: a.addressLine2 || '',
        city:         a.city         || '',
        state:        a.state        || '',
        postalCode:   a.postalCode   || '',
        country:      a.country      || '',
        addressType:  a.addressType  || '',
        isDefault:    a.isDefault    || false,
      },
    }));

const Profile = ({ onLogout }) => {
  const [activeTab, setActiveTab] = useState('details');
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving]       = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [addSaving, setAddSaving]       = useState(false);
  const emptyAddrForm = { addressLine1: '', addressLine2: '', city: '', state: '', postalCode: '', country: '', addressType: '', isDefault: false };
  const [addrForm, setAddrForm] = useState(emptyAddrForm);
  const [editModal, setEditModal] = useState(null); // { id, form }
  const [editSaving, setEditSaving] = useState(false);

  const loginInfo = getLoginInfo();

  const [form, setForm] = useState({
    firstName:    loginInfo.name?.split(' ')[0]  || '',
    lastName:     loginInfo.name?.split(' ').slice(1).join(' ') || '',
    email:        loginInfo.email        || '',
    phone:        loginInfo.phoneNumber  || '',
    userId:       loginInfo.userId       || null,
    profileImage: loginInfo.profileImage || null,
  });

  const [addresses, setAddresses] = useState([]);
  const [addrLoading, setAddrLoading] = useState(false);

  useEffect(() => {
    const info = getLoginInfo();
    setForm({
      firstName:    info.name?.split(' ')[0]  || '',
      lastName:     info.name?.split(' ').slice(1).join(' ') || '',
      email:        info.email        || '',
      phone:        info.phoneNumber  || '',
      userId:       info.userId       || null,
      profileImage: info.profileImage || null,
    });
  }, []);

  useEffect(() => {
    if (activeTab !== 'addresses' || !form.userId) return;
    setAddrLoading(true);
    getCustomerAddresses(form.userId)
      .then((res) => setAddresses(mapApiAddresses(Array.isArray(res) ? res : [], form.phone)))
      .catch((err) => showApiError(err, 'Failed to load addresses.'))
      .finally(() => setAddrLoading(false));
  }, [activeTab, form.userId]);

  const fullName = [form.firstName, form.lastName].filter(Boolean).join(' ');
  const avatarLetter = form.firstName?.charAt(0)?.toUpperCase() || 'U';

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateCustomerProfile(form.userId, {
        firstName:   form.firstName,
        lastName:    form.lastName,
        email:       form.email,
        phoneNumber: form.phone,
      });
      const stored = getLoginInfo();
      stored.name = fullName;
      localStorage.setItem('login', JSON.stringify(stored));
      setIsEditing(false);
      showApiSuccess('Profile updated successfully.');
    } catch (err) {
      showApiError(err, 'Failed to update profile.');
    } finally {
      setSaving(false);
    }
  };

  const handleAddAddress = async (e) => {
    e.preventDefault();
    setAddSaving(true);
    try {
      await addAddress({ userId: form.userId, ...addrForm });
      showApiSuccess('Address added successfully.');
      setShowAddModal(false);
      setAddrForm(emptyAddrForm);
      // re-fetch to get server-assigned addressId and updated list
      const updated = await getCustomerAddresses(form.userId);
      setAddresses(mapApiAddresses(Array.isArray(updated) ? updated : [], form.phone));
    } catch (err) {
      showApiError(err, 'Failed to add address.');
    } finally {
      setAddSaving(false);
    }
  };

  return (
    <div className='space-y-6'>

      {/* ── Hero ── */}
      <section className='relative overflow-hidden rounded-[32px] bg-gradient-to-br from-[#4a0e1c] via-[#7a1e2c] to-[#9e3140] p-7 text-white shadow-[0_32px_80px_rgba(66,18,28,0.28)] sm:p-10'>
        <div className='pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-white/5' />
        <div className='pointer-events-none absolute -bottom-10 -left-6 h-40 w-40 rounded-full bg-[#c9a227]/10' />
        <div className='pointer-events-none absolute right-32 bottom-0 h-24 w-24 rounded-full bg-white/5' />

        <div className='relative flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between'>
          <div className='flex items-center gap-5'>
            {/* Avatar */}
            <div className='relative shrink-0'>
              {form.profileImage ? (
                <img src={form.profileImage} alt='avatar' className='h-24 w-24 rounded-[28px] object-cover shadow-xl ring-4 ring-white/20' />
              ) : (
                <div className='flex h-24 w-24 items-center justify-center rounded-[28px] bg-gradient-to-br from-[#f5d47c] to-[#e8b84b] text-4xl font-bold text-[#5a1220] shadow-xl ring-4 ring-white/20'>
                  {avatarLetter}
                </div>
              )}
              <div className='absolute -bottom-1.5 -right-1.5 flex h-7 w-7 items-center justify-center rounded-full bg-emerald-400 shadow-lg ring-2 ring-white'>
                <CheckCircle2 size={14} className='text-white' />
              </div>
            </div>

            {/* Name + badges */}
            <div>
              <p className='text-[11px] font-bold uppercase tracking-[0.3em] text-white/50'>Customer Account</p>
              <h2 className='mt-1 text-2xl font-bold leading-tight sm:text-3xl'>{fullName || 'Customer'}</h2>
              <div className='mt-3 flex flex-wrap gap-2'>
                {form.email && (
                  <span className='inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5 text-xs font-semibold text-white/80 backdrop-blur-sm'>
                    <Mail size={11} /> {form.email}
                  </span>
                )}
                {form.phone && (
                  <span className='inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5 text-xs font-semibold text-white/80 backdrop-blur-sm'>
                    <Phone size={11} /> {form.phone}
                  </span>
                )}
              </div>
            </div>
          </div>

          <button
            type='button'
            onClick={onLogout}
            className='inline-flex items-center justify-center gap-2 self-start rounded-full border border-white/20 bg-white/10 px-5 py-2.5 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-white/20 sm:self-auto'
          >
            <LogOut size={15} /> Logout
          </button>
        </div>
      </section>

      {/* ── Tabs ── */}
      <div className='flex gap-2'>
        {TABS.map(({ id, label, icon: Icon }) => {
          const isActive = activeTab === id;
          return (
            <button
              key={id}
              type='button'
              onClick={() => { setActiveTab(id); setIsEditing(false); }}
              className={[
                'inline-flex items-center gap-2 rounded-2xl px-5 py-3 text-sm font-semibold transition',
                isActive
                  ? 'bg-[#7a1e2c] text-white shadow-lg shadow-[#7a1e2c]/25'
                  : 'border border-[#ead9cf] bg-white text-[#6b5048] hover:border-[#7a1e2c] hover:text-[#7a1e2c]',
              ].join(' ')}
            >
              <Icon size={15} /> {label}
            </button>
          );
        })}
      </div>

      {/* ── Details Tab ── */}
      {activeTab === 'details' && (
        <section className='overflow-hidden rounded-[28px] border border-[#efdcd2] bg-white shadow-[0_18px_45px_rgba(94,35,23,0.07)]'>
          <div className='flex items-center justify-between border-b border-[#f5e8e2] bg-gradient-to-r from-[#fffaf6] to-white px-6 py-5'>
            <div>
              <p className='text-[11px] font-bold uppercase tracking-[0.24em] text-[#a6806f]'>Personal details</p>
              <h3 className='mt-0.5 text-lg font-bold text-[#34160f]'>Your account information</h3>
            </div>
            {!isEditing ? (
              <button
                type='button'
                onClick={() => setIsEditing(true)}
                className='inline-flex items-center gap-2 rounded-2xl border border-[#ead9cf] bg-[#fffaf6] px-4 py-2.5 text-sm font-semibold text-[#7a1e2c] transition hover:bg-[#f9ede7]'
              >
                <Edit3 size={14} /> Edit
              </button>
            ) : (
              <div className='flex gap-2'>
                <button
                  type='button'
                  onClick={() => setIsEditing(false)}
                  className='inline-flex items-center gap-1.5 rounded-2xl border border-[#ead9cf] bg-white px-4 py-2.5 text-sm font-semibold text-[#8b6759] transition hover:bg-[#f9f0ec]'
                >
                  <X size={14} /> Cancel
                </button>
                <button
                  type='button'
                  onClick={handleSave}
                  disabled={saving}
                  className='inline-flex items-center gap-1.5 rounded-2xl bg-[#7a1e2c] px-4 py-2.5 text-sm font-semibold text-white shadow-md transition hover:bg-[#651623] disabled:opacity-60'
                >
                  <Save size={14} /> {saving ? 'Saving...' : 'Save'}
                </button>
              </div>
            )}
          </div>

          <div className='p-6'>
            {isEditing ? (
              <div className='grid gap-5 sm:grid-cols-2'>
                {[
                  { key: 'firstName', label: 'First Name',   placeholder: 'Enter first name',  icon: User  },
                  { key: 'lastName',  label: 'Last Name',    placeholder: 'Enter last name',   icon: User  },
                  { key: 'email',     label: 'Email Address', placeholder: 'Enter your email',  icon: Mail  },
                  { key: 'phone',     label: 'Phone Number', placeholder: 'Enter phone number', icon: Phone },
                ].map(({ key, label, placeholder, icon: Icon }) => (
                  <div key={key}>
                    <label className='mb-2 block text-xs font-bold uppercase tracking-[0.18em] text-[#a6806f]'>{label}</label>
                    <div className='relative'>
                      <span className='pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#c4a99e]'>
                        <Icon size={15} />
                      </span>
                      <input
                        value={form[key]}
                        onChange={(e) => setForm((prev) => ({ ...prev, [key]: e.target.value }))}
                        placeholder={placeholder}
                        className={`${inputCls} pl-10`}
                      />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className='grid gap-4 sm:grid-cols-2'>
                {[
                  { label: 'Full Name',     value: fullName,   icon: User  },
                  { label: 'Email Address', value: form.email, icon: Mail  },
                  { label: 'Phone Number',  value: form.phone, icon: Phone },
                ].map(({ label, value, icon: Icon }) => (
                  <div key={label} className='flex items-center gap-4 rounded-2xl border border-[#f0e0d6] bg-[#fffaf6] px-5 py-4 transition hover:border-[#e0c8be]'>
                    <div className='flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#fdeee8] to-[#f9ddd4] text-[#7a1e2c] shadow-sm'>
                      <Icon size={17} />
                    </div>
                    <div className='min-w-0'>
                      <p className='text-[10px] font-bold uppercase tracking-[0.22em] text-[#a6806f]'>{label}</p>
                      <p className='mt-0.5 truncate text-sm font-semibold text-[#34160f]'>{value || '—'}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* ── Addresses Tab ── */}
      {activeTab === 'addresses' && (
        <section className='overflow-hidden rounded-[28px] border border-[#efdcd2] bg-white shadow-[0_18px_45px_rgba(94,35,23,0.07)]'>
          <div className='flex items-center justify-between border-b border-[#f5e8e2] bg-gradient-to-r from-[#fffaf6] to-white px-6 py-5'>
            <div>
              <p className='text-[11px] font-bold uppercase tracking-[0.24em] text-[#a6806f]'>Saved addresses</p>
              <h3 className='mt-0.5 text-lg font-bold text-[#34160f]'>Manage delivery locations</h3>
            </div>
            <button
              type='button'
              onClick={() => setShowAddModal(true)}
              className='inline-flex items-center gap-2 rounded-2xl bg-[#7a1e2c] px-4 py-2.5 text-sm font-semibold text-white shadow-md transition hover:bg-[#651623]'
            >
              <Plus size={14} /> Add New
            </button>
          </div>

          <div className='space-y-4 p-6'>
            {addrLoading ? (
              <div className='flex items-center justify-center py-12'>
                <div className='h-8 w-8 animate-spin rounded-full border-4 border-[#ead9cf] border-t-[#7a1e2c]' />
              </div>
            ) : addresses.length === 0 ? (
              <div className='flex flex-col items-center justify-center py-12 text-center'>
                <div className='flex h-16 w-16 items-center justify-center rounded-full bg-[#f9ede7] text-[#7a1e2c]'>
                  <MapPin size={28} />
                </div>
                <p className='mt-4 text-sm font-semibold text-[#8b6759]'>No address found</p>
                <p className='mt-1 text-xs text-[#a6806f]'>Add a new delivery address to get started</p>
              </div>
            ) : (
              addresses.map(({ id, label, icon: AddrIcon, address, phone, default: isDefault }) => (
                <div key={id} className='group relative overflow-hidden rounded-[22px] border border-[#f0e0d6] bg-[#fffaf6] p-5 transition hover:border-[#d4a898] hover:shadow-md'>
                  <div className='absolute left-0 top-0 h-full w-1 rounded-l-[22px] bg-gradient-to-b from-[#7a1e2c] to-[#c9a227]' />
                  <div className='flex flex-col gap-4 pl-3 sm:flex-row sm:items-center sm:justify-between'>
                    <div className='flex items-start gap-4'>
                      <div className='flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#fdeee8] to-[#f9ddd4] text-[#7a1e2c] shadow-sm'>
                        <AddrIcon size={20} />
                      </div>
                      <div>
                        <div className='flex flex-wrap items-center gap-2'>
                          <span className='text-base font-bold text-[#34160f]'>{label}</span>
                          {isDefault && (
                            <span className='rounded-full bg-emerald-100 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-emerald-700'>
                              Default
                            </span>
                          )}
                        </div>
                        <p className='mt-1.5 text-sm text-[#5d4038]'>{address}</p>
                        <p className='mt-1 inline-flex items-center gap-1.5 text-xs text-[#a6806f]'>
                          <Phone size={11} /> {phone}
                        </p>
                      </div>
                    </div>
                    <div className='flex shrink-0 gap-2 pl-16 sm:pl-0'>
                      <button
                        type='button'
                        onClick={() => { const addr = addresses.find((a) => a.id === id); setEditModal({ id, addressId: addr?.addressId, form: { ...(addr?.rawFields || { addressLine1: '', addressLine2: '', city: '', state: '', postalCode: '', country: '', addressType: label, isDefault: isDefault || false }) } }); }}
                        className='inline-flex items-center gap-1.5 rounded-xl border border-[#ead9cf] bg-white px-3 py-2 text-xs font-semibold text-[#7a1e2c] transition hover:bg-[#f9ede7]'
                      >
                        <Edit3 size={12} /> Edit
                      </button>
                      <button
                        type='button'
                        onClick={async () => {
                          const addr = addresses.find((a) => a.id === id);
                          if (!addr?.addressId) return;
                          try {
                            await deleteAddress(addr.addressId);
                            setAddresses((prev) => prev.filter((a) => a.id !== id));
                            showApiSuccess('Address removed successfully.');
                          } catch (err) {
                            showApiError(err, 'Failed to remove address.');
                          }
                        }}
                        className='inline-flex items-center gap-1.5 rounded-xl border border-[#f1d5cf] bg-white px-3 py-2 text-xs font-semibold text-[#c44634] transition hover:bg-red-50'
                      >
                        <Trash2 size={12} /> Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      )}

      {/* ── Edit Address Modal ── */}
      {editModal && (
        <div className='fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4' style={{ backdropFilter: 'blur(6px)', background: 'rgba(47,29,24,0.45)' }}>
          <div className='w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-t-[28px] sm:rounded-[28px] bg-white shadow-2xl'>
            <div className='sticky top-0 z-10 flex items-center justify-between border-b border-[#f5e8e2] bg-gradient-to-r from-[#fffaf6] to-white px-5 py-4'>
              <div>
                <p className='text-[11px] font-bold uppercase tracking-[0.24em] text-[#a6806f]'>Edit Address</p>
                <h3 className='mt-0.5 text-base font-bold text-[#34160f]'>Update delivery address</h3>
              </div>
              <button type='button' onClick={() => setEditModal(null)} className='flex h-9 w-9 items-center justify-center rounded-full text-[#a67d65] hover:bg-[#f9ede7] hover:text-[#7a1e2c] transition'>
                <X size={18} />
              </button>
            </div>
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                setEditSaving(true);
                try {
                  const payload = { ...editModal.form };
                  await updateCustomerAddress(editModal.addressId, payload);
                  showApiSuccess('Address updated successfully.');
                  setEditModal(null);
                  const updated = await getCustomerAddresses(form.userId);
                  setAddresses(mapApiAddresses(Array.isArray(updated) ? updated : [], form.phone));
                } catch (err) {
                  showApiError(err, 'Failed to update address.');
                } finally {
                  setEditSaving(false);
                }
              }}
              className='space-y-4 p-5'
            >
              <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
                {[
                  { key: 'addressLine1', label: 'Address Line 1', placeholder: 'Street / Building', required: true },
                  { key: 'addressLine2', label: 'Address Line 2', placeholder: 'Apt / Block (optional)', required: false },
                  { key: 'city',        label: 'City',           placeholder: 'Enter city',          required: true },
                  { key: 'state',       label: 'State',          placeholder: 'Enter state',         required: true },
                  { key: 'postalCode',  label: 'Postal Code',    placeholder: 'Enter postal code',   required: true },
                  { key: 'country',     label: 'Country',        placeholder: 'Enter country',       required: true },
                  { key: 'addressType', label: 'Address Type',   placeholder: 'Home / Work / Other', required: true },
                ].map(({ key, label, placeholder, required }) => (
                  <div key={key}>
                    <label className='mb-1.5 block text-xs font-bold uppercase tracking-[0.18em] text-[#a6806f]'>{label}{required && <span className='ml-0.5 text-red-400'>*</span>}</label>
                    <input value={editModal.form[key]} onChange={(e) => setEditModal((prev) => ({ ...prev, form: { ...prev.form, [key]: e.target.value } }))} placeholder={placeholder} required={required} className={inputCls} />
                  </div>
                ))}
              </div>
              <label className='flex cursor-pointer items-center gap-3 rounded-2xl border border-[#f0e0d6] bg-[#fffaf6] px-4 py-3'>
                <input type='checkbox' checked={editModal.form.isDefault} onChange={(e) => setEditModal((prev) => ({ ...prev, form: { ...prev.form, isDefault: e.target.checked } }))} className='h-4 w-4 rounded accent-[#7a1e2c]' />
                <span className='text-sm font-semibold text-[#34160f]'>Set as default address</span>
              </label>
              <div className='flex gap-3 pt-1 pb-2'>
                <button type='button' onClick={() => setEditModal(null)} className='flex-1 rounded-2xl border border-[#ead9cf] bg-white py-3 text-sm font-semibold text-[#8b6759] transition hover:bg-[#f9f0ec]'>Cancel</button>
                <button type='submit' disabled={editSaving} className='flex-1 rounded-2xl bg-[#7a1e2c] py-3 text-sm font-semibold text-white shadow-md transition hover:bg-[#651623] disabled:opacity-60'>{editSaving ? 'Saving...' : 'Update Address'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Add Address Modal ── */}
      {showAddModal && (
        <div className='fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4' style={{ backdropFilter: 'blur(6px)', background: 'rgba(47,29,24,0.45)' }}>
          <div className='w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-t-[28px] sm:rounded-[28px] bg-white shadow-2xl'>

            {/* Modal header */}
            <div className='sticky top-0 z-10 flex items-center justify-between border-b border-[#f5e8e2] bg-gradient-to-r from-[#fffaf6] to-white px-5 py-4'>
              <div>
                <p className='text-[11px] font-bold uppercase tracking-[0.24em] text-[#a6806f]'>New Address</p>
                <h3 className='mt-0.5 text-base font-bold text-[#34160f]'>Add delivery address</h3>
              </div>
              <button
                type='button'
                onClick={() => { setShowAddModal(false); setAddrForm(emptyAddrForm); }}
                className='flex h-9 w-9 items-center justify-center rounded-full text-[#a67d65] hover:bg-[#f9ede7] hover:text-[#7a1e2c] transition'
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal form */}
            <form onSubmit={handleAddAddress} className='space-y-4 p-5'>
              <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
                {[
                  { key: 'addressLine1', label: 'Address Line 1', placeholder: 'Street / Building',    required: true  },
                  { key: 'addressLine2', label: 'Address Line 2', placeholder: 'Apt / Block (optional)', required: false },
                  { key: 'city',         label: 'City',           placeholder: 'Enter city',            required: true  },
                  { key: 'state',        label: 'State',          placeholder: 'Enter state',           required: true  },
                  { key: 'postalCode',   label: 'Postal Code',    placeholder: 'Enter postal code',     required: true  },
                  { key: 'country',      label: 'Country',        placeholder: 'Enter country',         required: true  },
                  { key: 'addressType',  label: 'Address Type',   placeholder: 'Home / Work / Other',   required: true  },
                ].map(({ key, label, placeholder, required }) => (
                  <div key={key}>
                    <label className='mb-1.5 block text-xs font-bold uppercase tracking-[0.18em] text-[#a6806f]'>
                      {label}{required && <span className='ml-0.5 text-red-400'>*</span>}
                    </label>
                    <input
                      value={addrForm[key]}
                      onChange={(e) => setAddrForm((prev) => ({ ...prev, [key]: e.target.value }))}
                      placeholder={placeholder}
                      required={required}
                      className={inputCls}
                    />
                  </div>
                ))}
              </div>

              <label className='flex cursor-pointer items-center gap-3 rounded-2xl border border-[#f0e0d6] bg-[#fffaf6] px-4 py-3'>
                <input
                  type='checkbox'
                  checked={addrForm.isDefault}
                  onChange={(e) => setAddrForm((prev) => ({ ...prev, isDefault: e.target.checked }))}
                  className='h-4 w-4 rounded accent-[#7a1e2c]'
                />
                <span className='text-sm font-semibold text-[#34160f]'>Set as default address</span>
              </label>

              <div className='flex gap-3 pt-1 pb-2'>
                <button
                  type='button'
                  onClick={() => { setShowAddModal(false); setAddrForm(emptyAddrForm); }}
                  className='flex-1 rounded-2xl border border-[#ead9cf] bg-white py-3 text-sm font-semibold text-[#8b6759] transition hover:bg-[#f9f0ec]'
                >
                  Cancel
                </button>
                <button
                  type='submit'
                  disabled={addSaving}
                  className='flex-1 rounded-2xl bg-[#7a1e2c] py-3 text-sm font-semibold text-white shadow-md transition hover:bg-[#651623] disabled:opacity-60'
                >
                  {addSaving ? 'Saving...' : 'Save Address'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default Profile;
