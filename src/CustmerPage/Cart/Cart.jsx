import { useState } from 'react';
import { ArrowRight, ShieldCheck, ShoppingBag, Trash2, Truck } from 'lucide-react';

const INITIAL_ITEMS = [
  { id: 1, name: 'Peacock Motif Paithani', seller: 'Ravi Handlooms', price: 14500, qty: 1 },
  { id: 2, name: 'Bridal Gold Border', seller: 'Sunita Weaves', price: 28000, qty: 1 },
];

const Cart = ({ onCheckout }) => {
  const [items, setItems] = useState(INITIAL_ITEMS);

  const updateQuantity = (id, change) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, qty: Math.max(1, item.qty + change) } : item,
      ),
    );
  };

  const removeItem = (id) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const subtotal = items.reduce((total, item) => total + item.price * item.qty, 0);
  const shipping = subtotal > 20000 ? 0 : 299;
  const total = subtotal + shipping;

  if (!items.length) {
    return (
      <div className='rounded-[32px] border border-dashed border-[#ddc6bb] bg-white px-6 py-16 text-center shadow-[0_18px_45px_rgba(94,35,23,0.06)]'>
        <div className='mx-auto flex h-20 w-20 items-center justify-center rounded-[28px] bg-[#fff1e7] text-[#7a1e2c]'>
          <ShoppingBag size={32} />
        </div>
        <h1 className='mt-6 text-2xl font-bold text-[#34160f]'>Your cart is empty</h1>
        <p className='mt-3 text-sm leading-7 text-[#8b6759]'>
          Add your favourite Paithani sarees to continue shopping.
        </p>
      </div>
    );
  }

  return (
    <div className='space-y-6'>
      <section className='rounded-[32px] border border-[#efdcd2] bg-white p-6 shadow-[0_18px_45px_rgba(94,35,23,0.08)]'>
        <p className='text-xs font-semibold uppercase tracking-[0.24em] text-[#a6806f]'>
          Shopping cart
        </p>
        <div className='mt-3 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between'>
          <div>
            <h1 className='text-3xl font-bold text-[#34160f]'>Review your selected sarees</h1>
            <p className='mt-2 text-sm leading-7 text-[#8b6759]'>
              This cart view is now customer-first and responsive for mobile checkout.
            </p>
          </div>
          <div className='flex flex-wrap gap-2'>
            <span className='inline-flex items-center gap-2 rounded-full bg-[#fff1e7] px-3 py-2 text-xs font-semibold text-[#7a1e2c]'>
              <Truck size={13} />
              Fast dispatch
            </span>
            <span className='inline-flex items-center gap-2 rounded-full bg-[#fff6df] px-3 py-2 text-xs font-semibold text-[#9b6a08]'>
              <ShieldCheck size={13} />
              Secure checkout
            </span>
          </div>
        </div>
      </section>

      <div className='grid gap-6 xl:grid-cols-[1fr_360px]'>
        <section className='space-y-4'>
          {items.map((item) => (
            <div
              key={item.id}
              className='rounded-[28px] border border-[#efdcd2] bg-white p-4 shadow-[0_18px_45px_rgba(94,35,23,0.08)] sm:p-5'
            >
              <div className='flex flex-col gap-4 sm:flex-row'>
                <div className='flex h-28 w-full items-center justify-center rounded-[24px] bg-gradient-to-br from-[#fff8f1] via-[#fdecd9] to-[#f7d9c6] text-5xl sm:h-32 sm:w-32'>
                  S
                </div>

                <div className='flex-1'>
                  <div className='flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between'>
                    <div>
                      <p className='text-lg font-bold text-[#34160f]'>{item.name}</p>
                      <p className='mt-1 text-sm text-[#8b6759]'>{item.seller}</p>
                    </div>
                    <p className='text-xl font-bold text-[#7a1e2c]'>
                      Rs {(item.price * item.qty).toLocaleString()}
                    </p>
                  </div>

                  <div className='mt-5 flex flex-wrap items-center gap-3'>
                    <div className='inline-flex items-center rounded-full border border-[#ead9cf] bg-[#fffaf6] px-3 py-2'>
                      <button
                        type='button'
                        onClick={() => updateQuantity(item.id, -1)}
                        className='h-8 w-8 rounded-full text-lg font-bold text-[#7a1e2c]'
                      >
                        -
                      </button>
                      <span className='w-10 text-center text-sm font-semibold text-[#34160f]'>
                        {item.qty}
                      </span>
                      <button
                        type='button'
                        onClick={() => updateQuantity(item.id, 1)}
                        className='h-8 w-8 rounded-full text-lg font-bold text-[#7a1e2c]'
                      >
                        +
                      </button>
                    </div>

                    <button
                      type='button'
                      onClick={() => removeItem(item.id)}
                      className='inline-flex items-center gap-2 rounded-full border border-[#f3d9d2] bg-[#fff5f4] px-4 py-2 text-sm font-semibold text-[#c44634]'
                    >
                      <Trash2 size={14} />
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </section>

        <aside className='rounded-[28px] border border-[#efdcd2] bg-white p-6 shadow-[0_18px_45px_rgba(94,35,23,0.08)] xl:sticky xl:top-28 xl:h-fit'>
          <p className='text-xs font-semibold uppercase tracking-[0.24em] text-[#a6806f]'>
            Order summary
          </p>
          <div className='mt-5 space-y-4 text-sm'>
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
            <div className='flex items-center justify-between border-t border-[#f1e2d8] pt-4'>
              <span className='text-base font-bold text-[#34160f]'>Total</span>
              <span className='text-2xl font-bold text-[#7a1e2c]'>Rs {total.toLocaleString()}</span>
            </div>
          </div>

          <div className='mt-5 rounded-[22px] bg-[#fff6df] p-4 text-sm leading-7 text-[#6b5048]'>
            {shipping === 0
              ? 'You unlocked free shipping for this order.'
              : 'Add premium items worth a little more to unlock free shipping.'}
          </div>

          <button
            type='button'
            onClick={onCheckout}
            className='mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#7a1e2c] px-5 py-3.5 text-sm font-bold text-white'
          >
            Proceed to checkout
            <ArrowRight size={16} />
          </button>
        </aside>
      </div>
    </div>
  );
};

export default Cart;
