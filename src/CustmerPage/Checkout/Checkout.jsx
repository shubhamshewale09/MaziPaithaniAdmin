import { useState } from 'react';
import {
  Banknote,
  CheckCircle,
  ChevronLeft,
  CreditCard,
  ShieldCheck,
  Smartphone,
} from 'lucide-react';

import { showApiError, showApiSuccess } from '../../Utils/Utils';
import { placeOrder } from '../../ServiceCustmer/Checkout/CheckoutApi';

const inputClassName =
  'w-full rounded-[18px] border border-[#ead9cf] bg-[#fffaf6] px-4 py-3 text-sm text-[#34160f] outline-none transition focus:border-[#7a1e2c]';

const PAYMENT_METHODS = [
  { id: 'upi', label: 'UPI / GPay / PhonePe', icon: Smartphone },
  { id: 'card', label: 'Credit / Debit card', icon: CreditCard },
  { id: 'cod', label: 'Cash on delivery', icon: Banknote },
];

const ORDER_ITEMS = [
  { name: 'Peacock Motif Paithani', qty: 1, price: 14500 },
  { name: 'Bridal Gold Border', qty: 1, price: 28000 },
];

const Checkout = ({ onBack, onSuccess }) => {
  const [form, setForm] = useState({
    name: '',
    phone: '',
    address: '',
    city: '',
    pincode: '',
  });
  const [paymentMethod, setPaymentMethod] = useState('upi');
  const [loading, setLoading] = useState(false);
  const [placed, setPlaced] = useState(false);

  const subtotal = ORDER_ITEMS.reduce((total, item) => total + item.qty * item.price, 0);
  const shipping = subtotal > 20000 ? 0 : 299;
  const total = subtotal + shipping;

  const updateField = (key, value) =>
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));

  const handlePlaceOrder = async (event) => {
    event.preventDefault();

    if (!form.name || !form.phone || !form.address) {
      showApiError('Please complete the required shipping details.');
      return;
    }

    setLoading(true);

    try {
      await placeOrder({
        ...form,
        paymentMethod,
        total,
        items: ORDER_ITEMS,
      });
      setPlaced(true);
      showApiSuccess('Order placed successfully.');
      onSuccess?.();
    } catch (error) {
      showApiError('Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (placed) {
    return (
      <div className='rounded-[32px] border border-[#d8ead7] bg-white px-6 py-16 text-center shadow-[0_18px_45px_rgba(94,35,23,0.06)]'>
        <div className='mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100 text-emerald-600'>
          <CheckCircle size={38} />
        </div>
        <h1 className='mt-6 text-3xl font-bold text-[#34160f]'>Order placed successfully</h1>
        <p className='mx-auto mt-3 max-w-xl text-sm leading-7 text-[#8b6759]'>
          Your order has moved into the customer order flow. You can now track status
          updates from the orders section.
        </p>
        <button
          type='button'
          onClick={onBack}
          className='mt-6 rounded-full bg-[#7a1e2c] px-6 py-3 text-sm font-bold text-white'
        >
          Continue shopping
        </button>
      </div>
    );
  }

  return (
    <div className='space-y-6'>
      <button
        type='button'
        onClick={onBack}
        className='inline-flex items-center gap-2 rounded-full border border-[#ead9cf] bg-white px-4 py-2 text-sm font-semibold text-[#7a1e2c]'
      >
        <ChevronLeft size={15} />
        Back to cart
      </button>

      <form onSubmit={handlePlaceOrder} className='grid gap-6 xl:grid-cols-[1fr_360px]'>
        <div className='space-y-6'>
          <section className='rounded-[32px] border border-[#efdcd2] bg-white p-6 shadow-[0_18px_45px_rgba(94,35,23,0.08)]'>
            <p className='text-xs font-semibold uppercase tracking-[0.24em] text-[#a6806f]'>
              Shipping details
            </p>
            <div className='mt-5 grid gap-5 md:grid-cols-2'>
              <div>
                <label className='mb-2 block text-sm font-semibold text-[#34160f]'>
                  Full name <span className='text-[#7a1e2c]'>*</span>
                </label>
                <input
                  value={form.name}
                  onChange={(event) => updateField('name', event.target.value)}
                  className={inputClassName}
                  placeholder='Enter your name'
                />
              </div>
              <div>
                <label className='mb-2 block text-sm font-semibold text-[#34160f]'>
                  Phone number <span className='text-[#7a1e2c]'>*</span>
                </label>
                <input
                  value={form.phone}
                  onChange={(event) => updateField('phone', event.target.value)}
                  className={inputClassName}
                  placeholder='10 digit mobile number'
                />
              </div>
            </div>

            <div className='mt-5'>
              <label className='mb-2 block text-sm font-semibold text-[#34160f]'>
                Address <span className='text-[#7a1e2c]'>*</span>
              </label>
              <textarea
                rows={4}
                value={form.address}
                onChange={(event) => updateField('address', event.target.value)}
                className={`${inputClassName} resize-none`}
                placeholder='House no, street, area, landmark'
              />
            </div>

            <div className='mt-5 grid gap-5 md:grid-cols-2'>
              <div>
                <label className='mb-2 block text-sm font-semibold text-[#34160f]'>City</label>
                <input
                  value={form.city}
                  onChange={(event) => updateField('city', event.target.value)}
                  className={inputClassName}
                  placeholder='City'
                />
              </div>
              <div>
                <label className='mb-2 block text-sm font-semibold text-[#34160f]'>Pincode</label>
                <input
                  value={form.pincode}
                  onChange={(event) => updateField('pincode', event.target.value)}
                  className={inputClassName}
                  placeholder='6 digit pincode'
                />
              </div>
            </div>
          </section>

          <section className='rounded-[32px] border border-[#efdcd2] bg-white p-6 shadow-[0_18px_45px_rgba(94,35,23,0.08)]'>
            <p className='text-xs font-semibold uppercase tracking-[0.24em] text-[#a6806f]'>
              Payment method
            </p>
            <div className='mt-5 space-y-3'>
              {PAYMENT_METHODS.map((item) => {
                const Icon = item.icon;
                const isActive = paymentMethod === item.id;

                return (
                  <button
                    key={item.id}
                    type='button'
                    onClick={() => setPaymentMethod(item.id)}
                    className={[
                      'flex w-full items-center gap-3 rounded-[22px] border px-4 py-4 text-left transition',
                      isActive
                        ? 'border-[#7a1e2c] bg-[#fff1e7] text-[#7a1e2c]'
                        : 'border-[#ead9cf] bg-[#fffaf6] text-[#6b5048]',
                    ].join(' ')}
                  >
                    <div className='flex h-11 w-11 items-center justify-center rounded-2xl bg-white shadow-sm'>
                      <Icon size={18} />
                    </div>
                    <span className='text-sm font-semibold'>{item.label}</span>
                    {isActive ? <CheckCircle size={18} className='ml-auto' /> : null}
                  </button>
                );
              })}
            </div>
          </section>
        </div>

        <aside className='rounded-[32px] border border-[#efdcd2] bg-white p-6 shadow-[0_18px_45px_rgba(94,35,23,0.08)] xl:sticky xl:top-28 xl:h-fit'>
          <p className='text-xs font-semibold uppercase tracking-[0.24em] text-[#a6806f]'>
            Order summary
          </p>

          <div className='mt-5 space-y-4'>
            {ORDER_ITEMS.map((item) => (
              <div key={item.name} className='flex items-center gap-3 rounded-[22px] bg-[#fffaf6] p-3'>
                <div className='flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[#fff8f1] via-[#fdecd9] to-[#f7d9c6] text-xl'>
                  S
                </div>
                <div className='flex-1'>
                  <p className='text-sm font-semibold text-[#34160f]'>{item.name}</p>
                  <p className='text-xs text-[#8b6759]'>Qty {item.qty}</p>
                </div>
                <p className='text-sm font-bold text-[#7a1e2c]'>
                  Rs {(item.qty * item.price).toLocaleString()}
                </p>
              </div>
            ))}
          </div>

          <div className='mt-5 space-y-3 border-t border-[#f1e2d8] pt-4 text-sm'>
            <div className='flex items-center justify-between text-[#6b5048]'>
              <span>Subtotal</span>
              <span className='font-semibold text-[#34160f]'>Rs {subtotal.toLocaleString()}</span>
            </div>
            <div className='flex items-center justify-between text-[#6b5048]'>
              <span>Shipping</span>
              <span className='font-semibold text-[#34160f]'>
                {shipping === 0 ? 'FREE' : `Rs ${shipping}`}
              </span>
            </div>
            <div className='flex items-center justify-between border-t border-[#f1e2d8] pt-3'>
              <span className='text-base font-bold text-[#34160f]'>Total</span>
              <span className='text-2xl font-bold text-[#7a1e2c]'>Rs {total.toLocaleString()}</span>
            </div>
          </div>

          <div className='mt-5 rounded-[22px] bg-[#fff6df] p-4 text-sm leading-7 text-[#6b5048]'>
            <span className='inline-flex items-center gap-2 font-semibold text-[#9b6a08]'>
              <ShieldCheck size={15} />
              Secure customer checkout
            </span>
            <p className='mt-2'>
              Your address and payment choice stay inside the buyer flow without any admin layout.
            </p>
          </div>

          <button
            type='submit'
            disabled={loading}
            className='mt-6 inline-flex w-full items-center justify-center rounded-full bg-[#7a1e2c] px-5 py-3.5 text-sm font-bold text-white disabled:opacity-60'
          >
            {loading ? 'Placing order...' : 'Place order'}
          </button>
        </aside>
      </form>
    </div>
  );
};

export default Checkout;
