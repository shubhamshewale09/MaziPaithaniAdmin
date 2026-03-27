import { useState } from 'react';
import { CreditCard, Smartphone, Banknote, CheckCircle, ChevronLeft } from 'lucide-react';
import { showApiSuccess, showApiError } from '../../Utils/Utils';
import { placeOrder } from '../../ServiceCustmer/Checkout/CheckoutApi';

const inputCls = 'w-full rounded-xl border border-[#e9d7cf] bg-white px-4 py-2.5 text-sm text-[#3d1e17] placeholder-[#b8a09a] outline-none focus:border-[#7a1e2c] focus:ring-1 focus:ring-[#7a1e2c] transition';

const PAYMENT_METHODS = [
  { id: 'upi',  label: 'UPI / GPay / PhonePe', icon: <Smartphone size={18} /> },
  { id: 'card', label: 'Credit / Debit Card',  icon: <CreditCard size={18} /> },
  { id: 'cod',  label: 'Cash on Delivery',     icon: <Banknote size={18} /> },
];

const ORDER_ITEMS = [
  { name: 'Peacock Motif Paithani', qty: 1, price: 14500 },
  { name: 'Bridal Gold Border',     qty: 1, price: 28000 },
];

const Checkout = ({ onBack, onSuccess }) => {
  const [form, setForm] = useState({ name: '', address: '', city: '', pincode: '', phone: '' });
  const [payment, setPayment] = useState('upi');
  const [loading, setLoading] = useState(false);
  const [placed, setPlaced] = useState(false);

  const set = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  const subtotal = ORDER_ITEMS.reduce((s, i) => s + i.price * i.qty, 0);
  const total    = subtotal + (subtotal > 20000 ? 0 : 299);

  const handlePlace = async (e) => {
    e.preventDefault();
    if (!form.name || !form.address || !form.phone) {
      showApiError('Please fill all required fields.');
      return;
    }
    setLoading(true);
    try {
      await placeOrder({ ...form, payment, items: ORDER_ITEMS, total });
      setPlaced(true);
      showApiSuccess('Order placed successfully!');
      onSuccess && onSuccess();
    } catch {
      showApiError('Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (placed) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 mb-5">
          <CheckCircle size={40} />
        </div>
        <h2 className="text-2xl font-bold text-[#3d1e17]">Order Placed!</h2>
        <p className="mt-2 text-sm text-[#9b7b69]">Your order has been confirmed. You'll receive updates shortly.</p>
        <button
          onClick={() => onBack && onBack()}
          className="mt-6 rounded-2xl bg-gradient-to-r from-[#7a1e2c] to-[#a52b39] px-8 py-3 text-sm font-bold text-white shadow-lg"
        >
          Continue Shopping
        </button>
      </div>
    );
  }

  return (
    <div>
      <button onClick={onBack} className="flex items-center gap-2 text-sm font-medium text-[#7a1e2c] mb-6 hover:underline">
        <ChevronLeft size={16} /> Back to Cart
      </button>
      <h1 className="text-2xl font-bold text-[#3d1e17] mb-6">Checkout</h1>

      <form onSubmit={handlePlace}>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_360px]">
          <div className="space-y-5">
            {/* Shipping */}
            <div className="rounded-[22px] border border-[#f0e4de] bg-white p-6 shadow-sm space-y-4">
              <p className="text-xs font-bold uppercase tracking-widest text-[#9b7b69]">Shipping Details</p>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-semibold text-[#3d1e17] mb-1.5">Full Name <span className="text-[#7a1e2c]">*</span></label>
                  <input className={inputCls} placeholder="Your full name" value={form.name} onChange={(e) => set('name', e.target.value)} />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#3d1e17] mb-1.5">Phone <span className="text-[#7a1e2c]">*</span></label>
                  <input className={inputCls} placeholder="10-digit mobile number" value={form.phone} onChange={(e) => set('phone', e.target.value)} />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#3d1e17] mb-1.5">Address <span className="text-[#7a1e2c]">*</span></label>
                <textarea rows={2} className={`${inputCls} resize-none`} placeholder="House no, Street, Area" value={form.address} onChange={(e) => set('address', e.target.value)} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#3d1e17] mb-1.5">City</label>
                  <input className={inputCls} placeholder="City" value={form.city} onChange={(e) => set('city', e.target.value)} />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#3d1e17] mb-1.5">Pincode</label>
                  <input className={inputCls} placeholder="6-digit pincode" value={form.pincode} onChange={(e) => set('pincode', e.target.value)} />
                </div>
              </div>
            </div>

            {/* Payment */}
            <div className="rounded-[22px] border border-[#f0e4de] bg-white p-6 shadow-sm space-y-3">
              <p className="text-xs font-bold uppercase tracking-widest text-[#9b7b69]">Payment Method</p>
              {PAYMENT_METHODS.map((m) => (
                <button
                  key={m.id} type="button"
                  onClick={() => setPayment(m.id)}
                  className={[
                    'flex w-full items-center gap-3 rounded-xl border-2 px-4 py-3 text-sm font-medium transition',
                    payment === m.id
                      ? 'border-[#7a1e2c] bg-[#fff8f3] text-[#7a1e2c]'
                      : 'border-[#e9d7cf] bg-white text-[#6a4a42] hover:border-[#7a1e2c]',
                  ].join(' ')}
                >
                  <span className={payment === m.id ? 'text-[#7a1e2c]' : 'text-[#9b7b69]'}>{m.icon}</span>
                  {m.label}
                  {payment === m.id && <CheckCircle size={16} className="ml-auto text-[#7a1e2c]" />}
                </button>
              ))}
            </div>
          </div>

          {/* Order Summary */}
          <div className="rounded-[22px] border border-[#f0e4de] bg-white p-6 shadow-sm h-fit">
            <p className="font-bold text-[#3d1e17] mb-4">Order Summary</p>
            <div className="space-y-3 mb-4">
              {ORDER_ITEMS.map((item) => (
                <div key={item.name} className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#fff8f3] text-xl shrink-0">🥻</div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-[#3d1e17] truncate">{item.name}</p>
                    <p className="text-xs text-[#9b7b69]">Qty: {item.qty}</p>
                  </div>
                  <p className="text-xs font-bold text-[#7a1e2c] shrink-0">₹{(item.price * item.qty).toLocaleString()}</p>
                </div>
              ))}
            </div>
            <div className="border-t border-[#f0e4de] pt-4 space-y-2 text-sm">
              <div className="flex justify-between text-[#6a4a42]">
                <span>Subtotal</span><span className="font-semibold text-[#3d1e17]">₹{subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-[#6a4a42]">
                <span>Shipping</span>
                <span className={`font-semibold ${subtotal > 20000 ? 'text-emerald-600' : 'text-[#3d1e17]'}`}>
                  {subtotal > 20000 ? 'FREE' : '₹299'}
                </span>
              </div>
              <div className="flex justify-between border-t border-[#f0e4de] pt-2">
                <span className="font-bold text-[#3d1e17]">Total</span>
                <span className="font-bold text-[#7a1e2c] text-lg">₹{total.toLocaleString()}</span>
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="mt-5 w-full rounded-2xl bg-gradient-to-r from-[#7a1e2c] to-[#a52b39] py-3.5 text-sm font-bold text-white shadow-lg transition hover:opacity-90 disabled:opacity-60"
            >
              {loading ? 'Placing Order...' : 'Place Order'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Checkout;
