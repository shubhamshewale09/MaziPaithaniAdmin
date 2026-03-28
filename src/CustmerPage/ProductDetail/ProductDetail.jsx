import { useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Heart,
  MessageCircle,
  Package,
  Palette,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Star,
  Store,
  Tag,
  Truck,
  Zap,
} from 'lucide-react';

const REVIEWS = [
  { id: 1, name: 'Priya S.',  rating: 5, comment: 'The zari work is beautiful and the saree felt premium from the first look.', date: '12 Jan 2024' },
  { id: 2, name: 'Meera K.',  rating: 4, comment: 'Very elegant color and helpful seller communication during dispatch.',        date: '8 Jan 2024'  },
  { id: 3, name: 'Anita R.',  rating: 5, comment: 'Perfect for wedding shopping. The pallu detailing looked even better in person.', date: '2 Jan 2024' },
];

const Pill = ({ icon: Icon, children }) => (
  <span className='inline-flex items-center gap-2 rounded-full bg-[#fff1e7] px-3 py-2 text-xs font-semibold text-[#7a1e2c]'>
    <Icon size={13} />{children}
  </span>
);

const AttrCard = ({ label, value }) => (
  <div className='rounded-[20px] border border-[#f1e2d8] bg-[#fffaf6] p-4'>
    <p className='text-xs font-semibold uppercase tracking-[0.2em] text-[#a6806f]'>{label}</p>
    <p className='mt-1.5 text-sm font-semibold text-[#34160f]'>{value}</p>
  </div>
);

const ProductDetail = ({ product, onBack, onAddToCart, onBuyNow, onCustomRequest, onChatSeller }) => {
  const [activeImage, setActiveImage] = useState(0);
  const [quantity, setQuantity]       = useState(1);
  const [wished, setWished]           = useState(false);

  const images      = product?.images ?? [];
  const hasImages   = images.length > 0;
  const total       = images.length;
  const isOutOfStock = (product?.stock ?? 0) === 0;

  const name        = product?.name        || 'Paithani Saree';
  const price       = product?.price       ?? 0;
  const seller      = product?.seller      || 'Paithani Artisan';
  const color       = product?.color       || '';
  const fabric      = product?.fabric      || '';
  const design      = product?.design      || '';
  const stock       = product?.stock       ?? 0;
  const description = product?.description || 'A handcrafted Paithani saree woven with rich zari work and festive-ready silk texture.';
  const isCustom    = product?.isCustomizationAvailable ?? false;

  const attrs = [
    color   && { label: 'Color',   value: color   },
    fabric  && { label: 'Fabric',  value: fabric  },
    design  && { label: 'Design',  value: design  },
    stock !== null && { label: 'Stock',   value: isOutOfStock ? 'Out of Stock' : `${stock} available` },
    isCustom && { label: 'Customization', value: 'Available on request' },
  ].filter(Boolean);

  return (
    <div className='mx-auto max-w-5xl space-y-5'>
      <button
        type='button'
        onClick={onBack}
        className='inline-flex items-center gap-2 rounded-full border border-[#ead9cf] bg-white px-4 py-2 text-sm font-semibold text-[#7a1e2c]'
      >
        <ChevronLeft size={15} /> Back to collection
      </button>

      <section className='grid gap-5 lg:grid-cols-[380px_1fr]'>

        {/* ── Image gallery ── */}
        <div className='space-y-3'>
          <div className='relative overflow-hidden rounded-[28px] border border-[#efdcd2] bg-[#faf7f5] shadow-sm' style={{ aspectRatio: '4/5' }}>
            {hasImages ? (
              <img
                src={images[activeImage]}
                alt={name}
                className='h-full w-full object-cover'
              />
            ) : (
              <div className='flex h-full w-full flex-col items-center justify-center'>
                <Package size={64} className='text-[#d4b5a8]' />
                <p className='mt-3 text-sm text-[#c4a090]'>No image available</p>
              </div>
            )}

            {total > 1 && (
              <>
                <button type='button'
                  onClick={() => setActiveImage((i) => (i - 1 + total) % total)}
                  className='absolute left-3 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-[#7a1e2c] shadow'>
                  <ChevronLeft size={18} />
                </button>
                <button type='button'
                  onClick={() => setActiveImage((i) => (i + 1) % total)}
                  className='absolute right-3 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-[#7a1e2c] shadow'>
                  <ChevronRight size={18} />
                </button>
              </>
            )}

            {isOutOfStock && (
              <div className='absolute inset-0 flex items-center justify-center bg-black/40'>
                <span className='rounded-full bg-white px-5 py-2 text-sm font-bold text-[#7a1e2c] shadow'>Out of Stock</span>
              </div>
            )}
          </div>

          {/* Thumbnails */}
          {total > 1 && (
            <div className='flex gap-2 overflow-x-auto pb-1' style={{ scrollbarWidth: 'none' }}>
              {images.map((src, i) => (
                <button key={i} type='button' onClick={() => setActiveImage(i)}
                  className={`h-16 w-16 shrink-0 overflow-hidden rounded-xl border-2 transition-all ${i === activeImage ? 'border-[#7a1e2c] scale-105' : 'border-[#ead9cf] hover:border-[#7a1e2c]/50'}`}>
                  <img src={src} alt='' className='h-full w-full object-cover' />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* ── Product info ── */}
        <div className='space-y-4'>

          {/* Header card */}
          <div className='rounded-[28px] border border-[#efdcd2] bg-white p-5 shadow-sm'>
            <div className='flex flex-wrap gap-2'>
              <Pill icon={Sparkles}>Handcrafted</Pill>
              <Pill icon={ShieldCheck}>Authentic artisan</Pill>
              {isCustom && <Pill icon={Palette}>Customizable</Pill>}
            </div>

            <h1 className='mt-3 text-xl font-bold text-[#34160f] sm:text-2xl'>{name}</h1>

            <div className='mt-3 flex flex-wrap items-center gap-3 text-sm text-[#8b6759]'>
              <span className='flex items-center gap-1 rounded-full bg-[#fff6db] px-3 py-1.5 font-semibold text-[#9b6a08]'>
                <Star size={12} fill='currentColor' /> 4.8
              </span>
              <span className='flex items-center gap-1.5'>
                <Store size={13} /> {seller}
              </span>
            </div>

            {/* Price */}
            <div className='mt-4 rounded-[20px] bg-[#fff7f2] p-4'>
              <p className='text-xs font-semibold uppercase tracking-[0.24em] text-[#a6806f]'>Price</p>
              <p className='mt-1 text-2xl font-extrabold text-[#7a1e2c]'>₹{price.toLocaleString('en-IN')}</p>
            </div>

            {/* Description */}
            {description && (
              <p className='mt-4 text-sm leading-7 text-[#6b5048]'>{description}</p>
            )}

            {/* Tags */}
            <div className='mt-3 flex flex-wrap gap-2'>
              {color  && <span className='inline-flex items-center gap-1 rounded-full bg-[#fff1e7] px-3 py-1 text-xs font-medium text-[#7a1e2c]'><Tag size={10} />{color}</span>}
              {fabric && <span className='rounded-full bg-[#f0f9f4] px-3 py-1 text-xs font-medium text-emerald-700'>{fabric}</span>}
              {design && <span className='rounded-full bg-[#f5f0ff] px-3 py-1 text-xs font-medium text-purple-700'>{design}</span>}
            </div>
          </div>

          {/* Attributes grid */}
          {attrs.length > 0 && (
            <div className='grid grid-cols-2 gap-3'>
              {attrs.map((a) => <AttrCard key={a.label} label={a.label} value={a.value} />)}
            </div>
          )}

          {/* Actions card */}
          <div className='rounded-[28px] border border-[#efdcd2] bg-white p-5 shadow-sm space-y-3'>
            {/* Qty + Wishlist */}
            <div className='flex items-center justify-between'>
              <div className='flex items-center rounded-full border border-[#ead9cf] bg-[#fffaf6] px-3 py-1.5'>
                <button type='button' onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className='h-8 w-8 text-lg font-bold text-[#7a1e2c]'>−</button>
                <span className='w-10 text-center text-sm font-semibold text-[#34160f]'>{quantity}</span>
                <button type='button' onClick={() => setQuantity((q) => q + 1)}
                  className='h-8 w-8 text-lg font-bold text-[#7a1e2c]'>+</button>
              </div>
              <div className='flex items-center gap-2'>
                {product?.sellerUserId && onChatSeller && (
                  <button type='button'
                    onClick={() => onChatSeller({ sellerId: product.sellerUserId, sellerName: seller })}
                    title={`Chat with ${seller}`}
                    className='flex h-11 w-11 items-center justify-center rounded-full border border-[#ead9cf] bg-white text-[#7a1e2c] hover:bg-[#fff1e7]'>
                    <MessageCircle size={16} />
                  </button>
                )}
                <button type='button' onClick={() => setWished((w) => !w)}
                  className={`flex h-11 w-11 items-center justify-center rounded-full border transition-all ${wished ? 'border-[#7a1e2c] bg-[#7a1e2c] text-white' : 'border-[#ead9cf] bg-white text-[#7a1e2c] hover:bg-[#fff1e7]'}`}>
                  <Heart size={16} fill={wished ? 'currentColor' : 'none'} />
                </button>
              </div>
            </div>

            <div className='flex items-center gap-1.5 text-xs text-[#8b6759]'>
              <Truck size={13} className='text-[#7a1e2c]' /> Free shipping on premium orders
            </div>

            <div className='grid gap-2 sm:grid-cols-2'>
              <button type='button' onClick={() => onAddToCart?.(product, quantity)} disabled={isOutOfStock}
                className={`inline-flex items-center justify-center gap-2 rounded-full border px-5 py-3.5 text-sm font-bold transition ${isOutOfStock ? 'border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed' : 'border-[#7a1e2c] bg-white text-[#7a1e2c] hover:bg-[#fff1e7]'}`}>
                <ShoppingBag size={15} /> Add to cart
              </button>
              <button type='button' onClick={() => onBuyNow?.(product, quantity)} disabled={isOutOfStock}
                className={`inline-flex items-center justify-center gap-2 rounded-full px-5 py-3.5 text-sm font-bold transition ${isOutOfStock ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-[#7a1e2c] text-white hover:bg-[#651623]'}`}>
                <Zap size={15} /> Buy now
              </button>
            </div>

            {isCustom && (
              <button type='button' onClick={() => onCustomRequest?.(product)}
                className='inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#fff6df] px-5 py-3.5 text-sm font-bold text-[#9b6a08] hover:bg-[#fef0c0] transition'>
                <Palette size={15} /> Request customization
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Reviews */}
      <section className='rounded-[28px] border border-[#efdcd2] bg-white p-5 shadow-sm'>
        <div className='flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between'>
          <div>
            <p className='text-xs font-semibold uppercase tracking-[0.24em] text-[#a6806f]'>Buyer reviews</p>
            <h2 className='mt-1 text-xl font-bold text-[#34160f]'>What customers are saying</h2>
          </div>
          <span className='rounded-full bg-[#fff6db] px-3 py-2 text-sm font-semibold text-[#9b6a08]'>128 reviews</span>
        </div>
        <div className='mt-5 grid gap-4 lg:grid-cols-3'>
          {REVIEWS.map((r) => (
            <div key={r.id} className='rounded-[20px] bg-[#fff7f2] p-5'>
              <div className='flex items-center justify-between gap-3'>
                <div>
                  <p className='font-semibold text-[#34160f]'>{r.name}</p>
                  <p className='text-xs text-[#8b6759]'>{r.date}</p>
                </div>
                <div className='flex items-center gap-0.5 text-[#9b6a08]'>
                  {Array.from({ length: r.rating }).map((_, i) => <Star key={i} size={11} fill='currentColor' />)}
                </div>
              </div>
              <p className='mt-3 text-sm leading-7 text-[#6b5048]'>{r.comment}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default ProductDetail;
