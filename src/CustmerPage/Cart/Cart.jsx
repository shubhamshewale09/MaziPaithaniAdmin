import { useState } from 'react';
import { Trash2, ShoppingBag, ArrowRight } from 'lucide-react';

const INIT_CART = [
  { id: 1, name: 'Peacock Motif Paithani', seller: 'Artisan Ravi',   price: 14500, qty: 1 },
  { id: 2, name: 'Bridal Gold Border',     seller: 'Weaver Sunita',  price: 28000, qty: 1 },
];

const Cart = ({ onCheckout }) => {
  const [items, setItems] = useState(INIT_CART);

  const updateQty = (id, delta) =>
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, qty: Math.max(1, item.qty + delta) } : item
      )
    );

  const remove = (id) => setItems((prev) => prev.filter((item) => item.id !== id));

  const subtotal  = items.reduce((s, i) => s + i.price * i.qty, 0);
  const shipping  = subtotal > 20000 ? 0 : 299;
  const total     = subtotal + shipping;

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-[28px] bg-gradient-to-br from-[#7a1e2c] to-[#c28b1e] text-white shadow-xl mb-5">
          <ShoppingBag size={32} />
        </div>
        <h2 className="text-xl font-bold text-[#3d1e17]">Your cart is empty</h2>
        <p className="mt-2 text-sm text-[#9b7b69]">Add some beautiful Paithani sarees to get started.</p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-[#3d1e17] mb-6">My Cart ({items.length})</h1>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_360px]">
        {/* Items */}
        <div className="space-y-4">
          {items.map((item) => (
            <div key={item.id} className="flex gap-4 rounded-[22px] border border-[#f0e4de] bg-white p-4 shadow-sm">
              <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#fff9f4] to-[#fde8d8] text-4xl">
                🥻
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-[#3d1e17] text-sm">{item.name}</p>
                <p className="text-xs text-[#9b7b69] mt-0.5">{item.seller}</p>
                <p className="text-sm font-bold text-[#7a1e2c] mt-1">₹{(item.price * item.qty).toLocaleString()}</p>
                <div className="flex items-center gap-2 mt-3">
                  <div className="flex items-center gap-2 rounded-xl border border-[#e9d7cf] bg-[#fff8f3] px-3 py-1.5">
                    <button onClick={() => updateQty(item.id, -1)} className="text-[#7a1e2c] font-bold w-4">−</button>
                    <span className="w-5 text-center text-sm font-semibold text-[#3d1e17]">{item.qty}</span>
                    <button onClick={() => updateQty(item.id, +1)} className="text-[#7a1e2c] font-bold w-4">+</button>
                  </div>
                  <button
                    onClick={() => remove(item.id)}
                    className="flex h-8 w-8 items-center justify-center rounded-xl border border-[#fde8d8] bg-[#fff5f5] text-red-500 transition hover:bg-red-50"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="rounded-[22px] border border-[#f0e4de] bg-white p-6 shadow-sm h-fit">
          <p className="font-bold text-[#3d1e17] mb-5">Order Summary</p>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between text-[#6a4a42]">
              <span>Subtotal ({items.length} items)</span>
              <span className="font-semibold text-[#3d1e17]">₹{subtotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-[#6a4a42]">
              <span>Shipping</span>
              <span className={`font-semibold ${shipping === 0 ? 'text-emerald-600' : 'text-[#3d1e17]'}`}>
                {shipping === 0 ? 'FREE' : `₹${shipping}`}
              </span>
            </div>
            {shipping === 0 && (
              <p className="text-xs text-emerald-600 bg-emerald-50 rounded-xl px-3 py-2">
                🎉 You qualify for free shipping!
              </p>
            )}
            <div className="border-t border-[#f0e4de] pt-3 flex justify-between">
              <span className="font-bold text-[#3d1e17]">Total</span>
              <span className="font-bold text-[#7a1e2c] text-lg">₹{total.toLocaleString()}</span>
            </div>
          </div>
          <button
            onClick={onCheckout}
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#7a1e2c] to-[#a52b39] py-3.5 text-sm font-bold text-white shadow-lg transition hover:opacity-90"
          >
            Proceed to Checkout <ArrowRight size={16} />
          </button>
          <p className="mt-3 text-center text-xs text-[#9b7b69]">Secure checkout · Free returns</p>
        </div>
      </div>
    </div>
  );
};

export default Cart;
