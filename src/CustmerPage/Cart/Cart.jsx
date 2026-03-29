import { memo, useEffect, useRef, useState } from 'react';
import {
  AlertTriangle,
  ArrowRight,
  Headphones,
  Minus,
  Package,
  Plus,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Trash2,
  Truck,
  X,
} from 'lucide-react';
import { getCartList, updateCartQuantity, deleteCartItem } from '../../ServiceCustmer/Cart/CartApi';
import Loader from '../../components/custom/Loader';

const BASE = 'http://15.207.106.250';
const imgUrl = (url) => (!url ? null : url.startsWith('http') ? url : `${BASE}${url}`);

/* ─── Confirmation modal ──────────────────────────────────────────────────── */
const ConfirmModal = ({ open, icon, iconBg, title, message, confirmLabel, confirmCls, loading, onConfirm, onCancel }) => {
  const ref = useRef(null);
  useEffect(() => { if (open) ref.current?.focus(); }, [open]);
  if (!open) return null;
  return (
    <div className='fixed inset-0 z-[999] flex items-center justify-center p-4'>
      <div
        className='absolute inset-0 bg-black/50 backdrop-blur-sm'
        style={{ animation: 'cmFadeIn 0.15s ease' }}
        onClick={onCancel}
      />
      <div
        ref={ref} tabIndex={-1}
        className='relative w-full max-w-[340px] rounded-[24px] border border-[#efdcd2] bg-white p-6 shadow-[0_24px_60px_rgba(94,35,23,0.28)] outline-none'
        style={{ animation: 'cmSlideUp 0.22s cubic-bezier(0.34,1.56,0.64,1)' }}
      >
        <button type='button' onClick={onCancel}
          className='absolute right-4 top-4 flex h-7 w-7 items-center justify-center rounded-full bg-[#f5ece7] text-[#8b6759] transition hover:bg-[#ffe4e4] hover:text-[#c44634]'>
          <X size={13} />
        </button>
        <div className={`mx-auto flex h-12 w-12 items-center justify-center rounded-2xl ${iconBg}`}>{icon}</div>
        <h3 className='mt-4 text-center text-base font-extrabold text-[#34160f]'>{title}</h3>
        <p className='mt-2 text-center text-sm leading-6 text-[#8b6759]'>{message}</p>
        <div className='mt-5 flex gap-3'>
          <button type='button' onClick={onCancel}
            className='flex-1 rounded-full border border-[#ead9cf] py-2.5 text-sm font-semibold text-[#6b5048] transition hover:bg-[#fff7f2]'>
            Cancel
          </button>
          <button type='button' onClick={onConfirm} disabled={loading}
            className={`flex-1 rounded-full py-2.5 text-sm font-bold text-white transition active:scale-95 disabled:opacity-60 ${confirmCls}`}>
            {loading ? 'Please wait…' : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

/* ─── Single cart product card ───────────────────────────────────────────── */
const CartItemCard = ({ item, index, onAskRemove, onAskQty, onChatSeller }) => {
  const src = imgUrl(item.images?.find((i) => i.bIsPrimary)?.sImageUrl ?? item.images?.[0]?.sImageUrl);

  return (
    <div
      className='group flex flex-col overflow-hidden rounded-2xl border border-[#efdcd2] bg-white transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(94,35,23,0.13)]'
      style={{
        boxShadow: '0 1px 6px rgba(94,35,23,0.07)',
        animation: 'cmSlideUp 0.32s ease both',
        animationDelay: `${index * 0.06}s`,
      }}
    >
      {/* ── Image ── */}
      <div className='relative w-full overflow-hidden bg-gradient-to-br from-[#fff8f1] to-[#f7d9c6]' style={{ aspectRatio: '3/2' }}>
        {src ? (
          <img
            src={src}
            alt={item.sProductTitle}
            className='h-full w-full object-cover object-top transition-transform duration-500 group-hover:scale-105'
          />
        ) : (
          <div className='flex h-full w-full items-center justify-center'>
            <Package size={24} className='text-[#d4b5a8]' />
          </div>
        )}
        {/* gradient */}
        <div className='absolute inset-x-0 bottom-0 h-14 bg-gradient-to-t from-black/55 to-transparent' />
        {/* price */}
        <div className='absolute bottom-2 left-2 rounded-full bg-white/95 px-2 py-0.5 text-[11px] font-extrabold text-[#7a1e2c] shadow-sm'>
          ₹{(item.priceAtTime * item.quantity).toLocaleString('en-IN')}
        </div>
        {/* remove */}
        <button
          type='button'
          onClick={() => onAskRemove(item)}
          className='absolute right-1.5 top-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-white/90 text-[#c44634] shadow-sm opacity-0 transition-all duration-200 group-hover:opacity-100 hover:bg-[#fee2e2]'
        >
          <Trash2 size={11} />
        </button>
        {!item.isAvailable && (
          <div className='absolute inset-0 flex items-center justify-center bg-black/40'>
            <span className='rounded-full bg-white px-2 py-0.5 text-[9px] font-bold text-[#7a1e2c]'>Unavailable</span>
          </div>
        )}
      </div>

      {/* ── Info ── */}
      <div className='flex flex-1 flex-col gap-0.5 p-2'>
        {/* product title */}
        <p className='line-clamp-2 text-[11px] font-bold leading-snug tracking-tight text-[#1a0a07]'>
          {item.sProductTitle}
        </p>

        {/* seller */}
        <p className='truncate text-[9px] font-medium italic text-[#a6806f]'>{item.sellerName}</p>

        {/* attributes */}
        <div className='flex flex-col gap-0.5'>
          {item.sColor && (
            <div className='flex items-center gap-1'>
              <span className='text-[8px] font-bold uppercase tracking-widest text-[#b19588]'>Color</span>
              <span className='rounded-sm bg-[#fff1e7] px-1.5 py-px text-[9px] font-semibold text-[#7a1e2c]'>{item.sColor}</span>
            </div>
          )}
          {item.sFabric && (
            <div className='flex items-center gap-1'>
              <span className='text-[8px] font-bold uppercase tracking-widest text-[#b19588]'>Fabric</span>
              <span className='rounded-sm bg-[#f0f9f4] px-1.5 py-px text-[9px] font-semibold text-emerald-700'>{item.sFabric}</span>
            </div>
          )}
          {item.sDesignType && (
            <div className='flex items-center gap-1'>
              <span className='text-[8px] font-bold uppercase tracking-widest text-[#b19588]'>Design</span>
              <span className='rounded-sm bg-[#f5f0ff] px-1.5 py-px text-[9px] font-semibold text-purple-700'>{item.sDesignType}</span>
            </div>
          )}
        </div>

        {/* unit price */}
        <p className='text-[9px] text-[#b19588]'>₹{item.priceAtTime.toLocaleString('en-IN')} each</p>

        {/* qty + ask */}
        <div className='mt-auto flex items-center justify-between gap-1 pt-1'>
          <div className='flex items-center gap-0.5 rounded-full border border-[#ead9cf] bg-[#fffaf6] px-1 py-0.5'>
            <button type='button' onClick={() => onAskQty(item, -1)} disabled={item.quantity <= 1}
              className='flex h-4 w-4 items-center justify-center rounded-full text-[#7a1e2c] transition hover:bg-[#fff1e7] disabled:opacity-30'>
              <Minus size={8} />
            </button>
            <span className='w-4 text-center text-[10px] font-extrabold text-[#34160f]'>{item.quantity}</span>
            <button type='button' onClick={() => onAskQty(item, 1)}
              className='flex h-4 w-4 items-center justify-center rounded-full text-[#7a1e2c] transition hover:bg-[#fff1e7]'>
              <Plus size={8} />
            </button>
          </div>
          {item.sellerUserId && (
            <button type='button'
              onClick={() => onChatSeller({ sellerId: item.sellerUserId, sellerName: item.sellerName })}
              title={`Chat with ${item.sellerName}`}
              className='inline-flex items-center gap-0.5 rounded-full border border-[#c28b1e]/40 bg-gradient-to-r from-[#fff6df] to-[#fff1e7] px-1.5 py-0.5 text-[9px] font-bold text-[#9b6a08] transition hover:from-[#fef0c0] hover:to-[#ffe4cc] active:scale-95'>
              <Headphones size={9} className='text-[#7a1e2c]' />
              Ask
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

/* ─── Main Cart ───────────────────────────────────────────────────────────── */
const Cart = memo(({ onCheckout, onChatSeller, onCartCountChange }) => {
  const [items, setItems]               = useState([]);
  const [loading, setLoading]           = useState(true);
  const [removeTarget, setRemoveTarget] = useState(null);
  const [removing, setRemoving]         = useState(false);
  const [qtyTarget, setQtyTarget]       = useState(null);
  const [qtyLoading, setQtyLoading]     = useState(false);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    getCartList()
      .then((res) => { if (!cancelled) setItems(res?.items ?? []); })
      .catch(()   => { if (!cancelled) setItems([]); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, []);

  const handleAskQty = (item, delta) => {
    const newQty = item.quantity + delta;
    if (newQty < 1) return;
    setQtyTarget({ item, delta, newQty });
  };

  const confirmQty = async () => {
    if (!qtyTarget) return;
    setQtyLoading(true);
    setItems((prev) => prev.map((i) =>
      i.cartItemId === qtyTarget.item.cartItemId ? { ...i, quantity: qtyTarget.newQty } : i,
    ));
    try { await updateCartQuantity(qtyTarget.item.cartItemId, qtyTarget.newQty); }
    catch { getCartList().then((r) => setItems(r?.items ?? [])); }
    finally { setQtyLoading(false); setQtyTarget(null); }
  };

  const confirmRemove = async () => {
    if (!removeTarget) return;
    setRemoving(true);
    try {
      await deleteCartItem(removeTarget.cartItemId);
      setItems((prev) => prev.filter((i) => i.cartItemId !== removeTarget.cartItemId));
      onCartCountChange?.((c) => Math.max(0, c - 1));
    } catch { getCartList().then((r) => setItems(r?.items ?? [])); }
    finally { setRemoving(false); setRemoveTarget(null); }
  };

  const subtotal = items.reduce((s, i) => s + i.priceAtTime * i.quantity, 0);
  const shipping = subtotal > 20000 ? 0 : 299;
  const total    = subtotal + shipping;
  const freeLeft = Math.max(0, 20000 - subtotal);
  const freePct  = Math.min(100, (subtotal / 20000) * 100);

  if (loading) return <div className='flex min-h-[300px] items-center justify-center'><Loader /></div>;

  if (!items.length) return (
    <div
      className='rounded-[28px] border border-dashed border-[#ddc6bb] bg-white px-6 py-20 text-center'
      style={{ boxShadow: '0 8px 30px rgba(94,35,23,0.06)', animation: 'cmSlideUp 0.35s ease' }}
    >
      <div className='mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-[24px] bg-[#fff1e7] text-[#7a1e2c]'
        style={{ boxShadow: '0 6px 20px rgba(122,30,44,0.12)' }}>
        <ShoppingBag size={34} />
      </div>
      <h1 className='text-xl font-extrabold text-[#34160f]'>Your cart is empty</h1>
      <p className='mt-2 text-sm text-[#8b6759]'>Add your favourite Paithani sarees to continue shopping.</p>
    </div>
  );

  return (
    <>
      {/* qty confirm */}
      <ConfirmModal
        open={!!qtyTarget}
        icon={qtyTarget?.delta > 0 ? <Plus size={20} className='text-[#7a1e2c]' /> : <Minus size={20} className='text-[#7a1e2c]' />}
        iconBg='bg-[#fff1e7]'
        title={qtyTarget?.delta > 0 ? 'Add one more?' : 'Remove one?'}
        message={qtyTarget ? `Update quantity to ${qtyTarget.newQty}?` : ''}
        confirmLabel='Yes, Update'
        confirmCls='bg-[#7a1e2c] hover:bg-[#651623]'
        loading={qtyLoading}
        onConfirm={confirmQty}
        onCancel={() => setQtyTarget(null)}
      />

      {/* remove confirm */}
      <ConfirmModal
        open={!!removeTarget}
        icon={<AlertTriangle size={20} className='text-[#c44634]' />}
        iconBg='bg-[#fff5f4]'
        title='Remove item?'
        message={removeTarget ? `Remove "${removeTarget.sProductTitle}" from your cart?` : ''}
        confirmLabel='Yes, Remove'
        confirmCls='bg-[#c44634] hover:bg-[#a83828]'
        loading={removing}
        onConfirm={confirmRemove}
        onCancel={() => setRemoveTarget(null)}
      />

      <div className='space-y-5' style={{ animation: 'cmSlideUp 0.28s ease' }}>

        {/* ── Header banner ── */}
        <section
          className='relative overflow-hidden rounded-[22px] p-5 text-white'
          style={{ background: 'linear-gradient(135deg,#4a0e1c 0%,#7a1e2c 60%,#3d0f1a 100%)', boxShadow: '0 8px 32px rgba(74,14,28,0.30)' }}
        >
          <div className='pointer-events-none absolute -right-8 -top-8 h-40 w-40 rounded-full bg-[#f5d47c]/10 blur-2xl' />
          <div className='pointer-events-none absolute -bottom-6 -left-6 h-32 w-32 rounded-full bg-white/5 blur-2xl' />

          <div className='relative flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between'>
            <div>
              <p className='text-[10px] font-bold uppercase tracking-[0.26em] text-[#f5d47c]/75'>Shopping cart</p>
              <h1 className='mt-0.5 text-xl font-extrabold sm:text-2xl'>
                Your Paithani Collection
                <span className='ml-2 inline-flex h-5 w-5 items-center justify-center rounded-full bg-[#f5d47c] text-[10px] font-extrabold text-[#3d0f1a]'>
                  {items.length}
                </span>
              </h1>
            </div>
            <div className='flex flex-wrap gap-1.5'>
              {[
                { icon: <Truck size={10} />, label: 'Fast dispatch' },
                { icon: <ShieldCheck size={10} />, label: 'Secure' },
                { icon: <Sparkles size={10} />, label: 'Authentic' },
              ].map((b) => (
                <span key={b.label} className='inline-flex items-center gap-1 rounded-full bg-white/10 px-2.5 py-1 text-[10px] font-semibold backdrop-blur-sm'>
                  {b.icon} {b.label}
                </span>
              ))}
            </div>
          </div>

          {/* free-shipping progress */}
          <div className='relative mt-3'>
            <div className='flex items-center justify-between text-[11px] text-white/65'>
              <span>{freeLeft === 0 ? '🎉 Free shipping unlocked!' : `₹${freeLeft.toLocaleString('en-IN')} more for free shipping`}</span>
              <span className='font-bold text-[#f5d47c]'>{Math.round(freePct)}%</span>
            </div>
            <div className='mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-white/15'>
              <div
                className='h-full rounded-full transition-all duration-700'
                style={{ width: `${freePct}%`, background: 'linear-gradient(90deg,#f5d47c,#c28b1e)', boxShadow: '0 0 6px rgba(245,212,124,0.5)' }}
              />
            </div>
          </div>
        </section>

        {/* ── chat-to-seller tip ── */}
        <div className='flex items-center gap-2.5 rounded-[16px] border border-[#fde8c0] bg-[#fffbf0] px-4 py-2.5'>
          <Headphones size={14} className='shrink-0 text-[#9b6a08]' />
          <p className='text-xs text-[#7a5a1a]'>
            <span className='font-semibold'>Have a question?</span> Tap <span className='font-semibold text-[#7a1e2c]'>Ask Seller</span> on any product to chat directly with the artisan.
          </p>
        </div>

        {/* ── Products grid + summary ── */}
        <div className='grid gap-5 lg:grid-cols-[1fr_300px]'>

          {/* 2-per-row product grid */}
          <div className='grid grid-cols-2 gap-2 sm:grid-cols-3'>
            {items.map((item, i) => (
              <CartItemCard
                key={item.cartItemId}
                item={item}
                index={i}
                onAskRemove={setRemoveTarget}
                onAskQty={handleAskQty}
                onChatSeller={onChatSeller}
              />
            ))}
          </div>

          {/* ── Order summary — same style as checkout aside ── */}
          <aside
            className='rounded-[28px] border border-[#efdcd2] bg-white p-5 lg:sticky lg:top-28 lg:h-fit'
            style={{ boxShadow: '0 18px_45px rgba(94,35,23,0.08)', animation: 'cmSlideUp 0.38s ease' }}
          >
            <p className='text-xs font-semibold uppercase tracking-[0.24em] text-[#a6806f]'>Order summary</p>

            {/* item lines — same as checkout */}
            <div className='mt-4 space-y-3'>
              {items.map((i) => (
                <div key={i.cartItemId} className='flex items-center gap-3 rounded-[18px] bg-[#fffaf6] p-2.5'>
                  <div className='h-10 w-10 shrink-0 overflow-hidden rounded-xl bg-gradient-to-br from-[#fff8f1] to-[#f7d9c6]'>
                    {imgUrl(i.images?.[0]?.sImageUrl) ? (
                      <img src={imgUrl(i.images?.[0]?.sImageUrl)} alt='' className='h-full w-full object-cover object-top' />
                    ) : (
                      <div className='flex h-full w-full items-center justify-center'>
                        <Package size={14} className='text-[#d4b5a8]' />
                      </div>
                    )}
                  </div>
                  <div className='min-w-0 flex-1'>
                    <p className='truncate text-xs font-semibold text-[#34160f]'>{i.sProductTitle}</p>
                    <p className='text-[10px] text-[#8b6759]'>Qty {i.quantity}</p>
                  </div>
                  <p className='shrink-0 text-xs font-bold text-[#7a1e2c]'>
                    ₹{(i.priceAtTime * i.quantity).toLocaleString('en-IN')}
                  </p>
                </div>
              ))}
            </div>

            {/* totals */}
            <div className='mt-4 space-y-3 border-t border-[#f1e2d8] pt-4 text-sm'>
              <div className='flex items-center justify-between text-[#6b5048]'>
                <span>Subtotal</span>
                <span className='font-semibold text-[#34160f]'>₹{subtotal.toLocaleString('en-IN')}</span>
              </div>
              <div className='flex items-center justify-between text-[#6b5048]'>
                <span>Shipping</span>
                <span className={`font-semibold ${shipping === 0 ? 'text-emerald-600' : 'text-[#34160f]'}`}>
                  {shipping === 0 ? 'FREE' : `₹${shipping}`}
                </span>
              </div>
              <div className='flex items-center justify-between border-t border-[#f1e2d8] pt-3'>
                <span className='text-base font-bold text-[#34160f]'>Total</span>
                <span className='text-2xl font-bold text-[#7a1e2c]'>₹{total.toLocaleString('en-IN')}</span>
              </div>
            </div>

            {/* secure badge — same as checkout */}
            <div className='mt-4 rounded-[18px] bg-[#fff6df] p-3.5 text-sm leading-6 text-[#6b5048]'>
              <span className='inline-flex items-center gap-1.5 font-semibold text-[#9b6a08]'>
                <ShieldCheck size={14} /> Secure checkout
              </span>
              <p className='mt-1 text-xs'>Your payment and address are fully encrypted and safe.</p>
            </div>

            <button
              type='button'
              onClick={onCheckout}
              className='mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#7a1e2c] px-5 py-3.5 text-sm font-bold text-white transition hover:bg-[#651623] active:scale-95'
            >
              Proceed to checkout <ArrowRight size={15} />
            </button>
            <p className='mt-2.5 text-center text-xs text-[#b19588]'>Taxes calculated at checkout</p>
          </aside>
        </div>
      </div>
    </>
  );
});

export default Cart;
