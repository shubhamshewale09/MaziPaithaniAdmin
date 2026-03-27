import { useMemo, useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Heart,
  MapPin,
  Palette,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Star,
  Truck,
  Zap,
} from 'lucide-react';

const GALLERY = ['S', 'P', 'Z', 'M'];

const REVIEWS = [
  {
    id: 1,
    name: 'Priya S.',
    rating: 5,
    comment: 'The zari work is beautiful and the saree felt premium from the first look.',
    date: '12 Jan 2024',
  },
  {
    id: 2,
    name: 'Meera K.',
    rating: 4,
    comment: 'Very elegant color and helpful seller communication during dispatch.',
    date: '8 Jan 2024',
  },
  {
    id: 3,
    name: 'Anita R.',
    rating: 5,
    comment: 'Perfect for wedding shopping. The pallu detailing looked even better in person.',
    date: '2 Jan 2024',
  },
];

const DetailPill = ({ icon: Icon, children }) => (
  <span className='inline-flex items-center gap-2 rounded-full bg-[#fff1e7] px-3 py-2 text-xs font-semibold text-[#7a1e2c]'>
    <Icon size={13} />
    {children}
  </span>
);

const ProductDetail = ({ product, onBack, onAddToCart, onBuyNow, onCustomRequest }) => {
  const [activeImage, setActiveImage] = useState(0);
  const [quantity, setQuantity] = useState(1);

  const details = useMemo(
    () => ({
      name: product?.name || 'Peacock Motif Paithani',
      price: product?.price || 'Rs 14,500 - Rs 18,000',
      seller: product?.seller || 'Ravi Handlooms',
      rating: product?.rating || 4.8,
      location: product?.location || 'Yeola, Nashik',
      description:
        'A handcrafted Paithani saree woven with rich zari work, a statement pallu, and festive-ready silk texture for bridal and special-occasion shopping.',
      attributes: {
        Fabric: product?.fabric || 'Pure Silk',
        Color: product?.color || 'Emerald Green',
        Design: product?.design || 'Traditional',
        Border: 'Rich Gold Zari',
        Blouse: 'Matching blouse piece included',
        Delivery: 'Ships in 4-6 days',
      },
    }),
    [product],
  );

  return (
    <div className='space-y-6 sm:space-y-8'>
      <button
        type='button'
        onClick={onBack}
        className='inline-flex items-center gap-2 rounded-full border border-[#ead9cf] bg-white px-4 py-2 text-sm font-semibold text-[#7a1e2c]'
      >
        <ChevronLeft size={15} />
        Back to collection
      </button>

      <section className='grid gap-6 xl:grid-cols-[1.05fr_0.95fr]'>
        <div className='space-y-4'>
          <div className='relative overflow-hidden rounded-[32px] border border-[#efdcd2] bg-gradient-to-br from-[#fff8f1] via-[#fdecd9] to-[#f7d9c6] p-5 shadow-[0_22px_60px_rgba(94,35,23,0.1)]'>
            <div className='flex h-[360px] items-center justify-center rounded-[28px] border border-white/50 bg-white/30 text-8xl shadow-inner sm:h-[460px]'>
              {GALLERY[activeImage]}
            </div>

            <button
              type='button'
              onClick={() =>
                setActiveImage((prev) => (prev - 1 + GALLERY.length) % GALLERY.length)
              }
              className='absolute left-8 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-[#7a1e2c] shadow-sm'
            >
              <ChevronLeft size={18} />
            </button>
            <button
              type='button'
              onClick={() => setActiveImage((prev) => (prev + 1) % GALLERY.length)}
              className='absolute right-8 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-[#7a1e2c] shadow-sm'
            >
              <ChevronRight size={18} />
            </button>
          </div>

          <div className='grid grid-cols-4 gap-3'>
            {GALLERY.map((item, index) => (
              <button
                key={item}
                type='button'
                onClick={() => setActiveImage(index)}
                className={[
                  'flex h-20 items-center justify-center rounded-[22px] border text-2xl font-bold transition sm:h-24',
                  activeImage === index
                    ? 'border-[#7a1e2c] bg-[#fff1e7] text-[#7a1e2c]'
                    : 'border-[#ead9cf] bg-white text-[#8b6759]',
                ].join(' ')}
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        <div className='space-y-5'>
          <section className='rounded-[32px] border border-[#efdcd2] bg-white p-6 shadow-[0_22px_60px_rgba(94,35,23,0.08)]'>
            <div className='flex flex-wrap gap-2'>
              <DetailPill icon={Sparkles}>Customer favourite</DetailPill>
              <DetailPill icon={ShieldCheck}>Authentic artisan listing</DetailPill>
            </div>

            <h1 className='mt-4 text-3xl font-bold text-[#34160f] sm:text-4xl'>
              {details.name}
            </h1>

            <div className='mt-4 flex flex-wrap items-center gap-3 text-sm text-[#8b6759]'>
              <span className='flex items-center gap-1 rounded-full bg-[#fff6db] px-3 py-2 font-semibold text-[#9b6a08]'>
                <Star size={13} fill='currentColor' />
                {details.rating}
              </span>
              <span className='flex items-center gap-1'>
                <MapPin size={14} />
                {details.location}
              </span>
              <span>Sold by {details.seller}</span>
            </div>

            <div className='mt-5 rounded-[24px] bg-[#fff7f2] p-5'>
              <p className='text-xs font-semibold uppercase tracking-[0.24em] text-[#a6806f]'>
                Price range
              </p>
              <p className='mt-2 text-3xl font-bold text-[#7a1e2c]'>{details.price}</p>
              <p className='mt-2 text-sm leading-7 text-[#8b6759]'>
                {details.description}
              </p>
            </div>

            <div className='mt-5 grid gap-3 sm:grid-cols-2'>
              {Object.entries(details.attributes).map(([label, value]) => (
                <div key={label} className='rounded-[22px] border border-[#f1e2d8] bg-[#fffaf6] p-4'>
                  <p className='text-xs font-semibold uppercase tracking-[0.2em] text-[#a6806f]'>
                    {label}
                  </p>
                  <p className='mt-2 text-sm font-semibold text-[#34160f]'>{value}</p>
                </div>
              ))}
            </div>
          </section>

          <section className='rounded-[32px] border border-[#efdcd2] bg-white p-6 shadow-[0_22px_60px_rgba(94,35,23,0.08)]'>
            <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
              <div className='flex items-center gap-3'>
                <div className='flex items-center rounded-full border border-[#ead9cf] bg-[#fffaf6] px-3 py-2'>
                  <button
                    type='button'
                    onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                    className='h-8 w-8 rounded-full text-lg font-bold text-[#7a1e2c]'
                  >
                    -
                  </button>
                  <span className='w-10 text-center text-sm font-semibold text-[#34160f]'>
                    {quantity}
                  </span>
                  <button
                    type='button'
                    onClick={() => setQuantity((prev) => prev + 1)}
                    className='h-8 w-8 rounded-full text-lg font-bold text-[#7a1e2c]'
                  >
                    +
                  </button>
                </div>
                <button
                  type='button'
                  className='flex h-11 w-11 items-center justify-center rounded-full border border-[#ead9cf] bg-white text-[#7a1e2c]'
                >
                  <Heart size={16} />
                </button>
              </div>

              <div className='flex items-center gap-2 text-sm text-[#8b6759]'>
                <Truck size={15} className='text-[#7a1e2c]' />
                Free shipping on premium orders
              </div>
            </div>

            <div className='mt-5 grid gap-3 sm:grid-cols-2'>
              <button
                type='button'
                onClick={() => onAddToCart?.(details, quantity)}
                className='inline-flex items-center justify-center gap-2 rounded-full border border-[#7a1e2c] bg-white px-5 py-3.5 text-sm font-bold text-[#7a1e2c]'
              >
                <ShoppingBag size={16} />
                Add to cart
              </button>
              <button
                type='button'
                onClick={() => onBuyNow?.(details, quantity)}
                className='inline-flex items-center justify-center gap-2 rounded-full bg-[#7a1e2c] px-5 py-3.5 text-sm font-bold text-white'
              >
                <Zap size={16} />
                Buy now
              </button>
            </div>

            <button
              type='button'
              onClick={() => onCustomRequest?.(details)}
              className='mt-3 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#fff6df] px-5 py-3.5 text-sm font-bold text-[#9b6a08]'
            >
              <Palette size={16} />
              Request customization
            </button>
          </section>
        </div>
      </section>

      <section className='rounded-[32px] border border-[#efdcd2] bg-white p-6 shadow-[0_22px_60px_rgba(94,35,23,0.08)]'>
        <div className='flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between'>
          <div>
            <p className='text-xs font-semibold uppercase tracking-[0.24em] text-[#a6806f]'>
              Buyer reviews
            </p>
            <h2 className='mt-2 text-2xl font-bold text-[#34160f]'>
              What customers are saying
            </h2>
          </div>
          <span className='rounded-full bg-[#fff6db] px-3 py-2 text-sm font-semibold text-[#9b6a08]'>
            128 reviews
          </span>
        </div>

        <div className='mt-6 grid gap-4 lg:grid-cols-3'>
          {REVIEWS.map((review) => (
            <div key={review.id} className='rounded-[24px] bg-[#fff7f2] p-5'>
              <div className='flex items-center justify-between gap-3'>
                <div>
                  <p className='font-semibold text-[#34160f]'>{review.name}</p>
                  <p className='text-xs text-[#8b6759]'>{review.date}</p>
                </div>
                <div className='flex items-center gap-1 text-[#9b6a08]'>
                  {Array.from({ length: review.rating }).map((_, index) => (
                    <Star key={index} size={12} fill='currentColor' />
                  ))}
                </div>
              </div>
              <p className='mt-4 text-sm leading-7 text-[#6b5048]'>{review.comment}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default ProductDetail;
