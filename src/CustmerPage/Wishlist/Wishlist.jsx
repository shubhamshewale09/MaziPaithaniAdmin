import { useMemo, useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Heart,
  MessageCircle,
  Package,
  Palette,
  ShoppingCart,
  SlidersHorizontal,
  Store,
  X,
  Zap,
} from 'lucide-react';

// ── Filter chip ───────────────────────────────────────────────────────────────
const Chip = ({ active, onClick, children }) => (
  <button
    type='button'
    onClick={onClick}
    className={[
      'rounded-full border px-3 py-1.5 text-xs font-semibold transition',
      active
        ? 'border-[#7a1e2c] bg-[#7a1e2c] text-white'
        : 'border-[#ead9cf] bg-white text-[#6b5048] hover:border-[#7a1e2c] hover:text-[#7a1e2c]',
    ].join(' ')}
  >
    {children}
  </button>
);

// ── Wishlist product card ─────────────────────────────────────────────────────
const WishlistCard = ({ item, onRemove, onAddToCart, onView, onChatSeller, inCart }) => {
  const [activeImg, setActiveImg] = useState(0);
  const total = item.images.length;
  const hasImages = total > 0;
  const isReady = item.stock > 0;

  return (
    <div className='group flex flex-col bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5'>

      {/* Image — square crop, fully visible */}
      <div className='relative overflow-hidden bg-[#faf7f5]' style={{ aspectRatio: '1/1' }}>
        {hasImages ? (
          <img
            src={item.images[activeImg]}
            alt={item.name}
            className='w-full h-full object-contain transition-transform duration-500 group-hover:scale-105 cursor-pointer'
            onClick={() => onView(item)}
          />
        ) : (
          <div className='w-full h-full flex flex-col items-center justify-center cursor-pointer' onClick={() => onView(item)}>
            <Package size={32} className='text-[#d4b5a8]' />
            <p className='mt-1 text-[10px] text-[#c4a090]'>No image</p>
          </div>
        )}

        {/* Stock badge */}
        <span className={`absolute top-2 left-2 text-white text-[9px] font-bold px-2 py-0.5 rounded-full shadow ${
          isReady ? 'bg-emerald-600' : 'bg-[#7a1e2c]'
        }`}>
          {isReady ? 'Ready Stock' : 'Made to Order'}
        </span>

        {/* Remove heart */}
        <button
          type='button'
          onClick={(e) => { e.stopPropagation(); onRemove(item.id); }}
          className='absolute top-2 right-2 h-7 w-7 flex items-center justify-center rounded-full bg-[#7a1e2c] text-white shadow transition hover:bg-[#651623]'
          title='Remove from wishlist'
        >
          <Heart size={12} fill='currentColor' />
        </button>

        {/* Image nav */}
        {total > 1 && (
          <>
            <button type='button'
              onClick={(e) => { e.stopPropagation(); setActiveImg((i) => (i - 1 + total) % total); }}
              className='absolute left-1.5 top-1/2 -translate-y-1/2 h-6 w-6 flex items-center justify-center rounded-full bg-white/85 text-[#7a1e2c] shadow opacity-0 group-hover:opacity-100 transition-opacity'>
              <ChevronLeft size={12} />
            </button>
            <button type='button'
              onClick={(e) => { e.stopPropagation(); setActiveImg((i) => (i + 1) % total); }}
              className='absolute right-1.5 top-1/2 -translate-y-1/2 h-6 w-6 flex items-center justify-center rounded-full bg-white/85 text-[#7a1e2c] shadow opacity-0 group-hover:opacity-100 transition-opacity'>
              <ChevronRight size={12} />
            </button>
          </>
        )}
      </div>

      {/* Info */}
      <div className='flex flex-col flex-1 p-3'>
        {/* Seller */}
        <div className='flex items-center gap-1 mb-1'>
          <Store size={10} className='text-[#a6806f] shrink-0' />
          <p className='text-[10px] text-[#a6806f] font-medium truncate'>{item.seller || 'Paithani Artisan'}</p>
        </div>

        {/* Title */}
        <p
          className='text-xs font-bold text-[#1a0a07] leading-snug line-clamp-2 cursor-pointer hover:text-[#7a1e2c] transition-colors mb-1.5'
          onClick={() => onView(item)}
          title={item.name}
        >
          {item.name}
        </p>

        {/* Price */}
        <p className='text-sm font-extrabold text-[#7a1e2c] mb-1.5'>
          ₹{item.price.toLocaleString('en-IN')}
        </p>

        {/* Attributes — max 2 chips to keep compact */}
        <div className='flex flex-wrap gap-1 mb-2'>
          {item.fabric && (
            <span className='text-[9px] bg-[#f0f9f4] text-emerald-700 px-1.5 py-0.5 rounded-full font-semibold'>🧵 {item.fabric}</span>
          )}
          {item.color && (
            <span className='text-[9px] bg-[#fff1e7] text-[#7a1e2c] px-1.5 py-0.5 rounded-full font-semibold'>🎨 {item.color}</span>
          )}
        </div>

        {/* Action icons + CTA */}
        <div className='mt-auto flex items-center gap-1.5'>
          <button
            type='button'
            onClick={() => onView(item)}
            title='View details'
            className='flex items-center justify-center h-7 w-7 rounded-lg border border-[#e8d5cc] text-[#7a1e2c] hover:bg-[#fff1e7] transition-colors shrink-0'
          >
            <Zap size={11} />
          </button>
          {item.sellerUserId && (
            <button
              type='button'
              onClick={(e) => { e.stopPropagation(); onChatSeller({ sellerId: item.sellerUserId, sellerName: item.seller }); }}
              title='Contact seller'
              className='flex items-center justify-center h-7 w-7 rounded-lg border border-[#e8d5cc] text-[#7a1e2c] hover:bg-[#fff1e7] transition-colors shrink-0'
            >
              <MessageCircle size={11} />
            </button>
          )}
          {isReady ? (
            <button
              type='button'
              onClick={() => onAddToCart(item)}
              className={`flex-1 flex items-center justify-center gap-1 py-1.5 rounded-lg text-[10px] font-bold transition-all duration-200 ${
                inCart ? 'bg-emerald-600 text-white' : 'bg-[#7a1e2c] text-white hover:bg-[#651623] active:scale-95'
              }`}
            >
              <ShoppingCart size={11} />
              {inCart ? 'Go to Cart' : 'Add to Cart'}
            </button>
          ) : (
            <button
              type='button'
              onClick={() => onChatSeller({ sellerId: item.sellerUserId, sellerName: item.seller })}
              className='flex-1 flex items-center justify-center gap-1 py-1.5 rounded-lg text-[10px] font-bold bg-amber-600 text-white hover:bg-amber-700 active:scale-95 transition-all duration-200'
            >
              <Palette size={11} />
              Customize
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

// ── Empty state ───────────────────────────────────────────────────────────────
const EmptyWishlist = ({ onShop }) => (
  <div className='rounded-[32px] border border-dashed border-[#ddc6bb] bg-white px-6 py-20 text-center shadow-[0_18px_45px_rgba(94,35,23,0.06)]'>
    <div className='mx-auto flex h-20 w-20 items-center justify-center rounded-[28px] bg-[#fff1e7] text-[#7a1e2c]'>
      <Heart size={32} />
    </div>
    <h2 className='mt-6 text-2xl font-bold text-[#34160f]'>Your wishlist is empty</h2>
    <p className='mt-3 text-sm leading-7 text-[#8b6759]'>
      Save your favourite Paithani sarees here to compare and buy later.
    </p>
    <button
      type='button'
      onClick={onShop}
      className='mt-6 inline-flex items-center gap-2 rounded-full bg-[#7a1e2c] px-6 py-3 text-sm font-bold text-white hover:bg-[#651623] transition-colors'
    >
      <ShoppingCart size={15} /> Browse Sarees
    </button>
  </div>
);

// ── Filter panel ──────────────────────────────────────────────────────────────
const FilterPanel = ({ items, filters, onToggle, onClear }) => {
  const sections = useMemo(() => [
    { key: 'color',  label: 'Color',  options: [...new Set(items.map((p) => p.color).filter(Boolean))] },
    { key: 'fabric', label: 'Fabric', options: [...new Set(items.map((p) => p.fabric).filter(Boolean))] },
    { key: 'design', label: 'Design', options: [...new Set(items.map((p) => p.design).filter(Boolean))] },
    { key: 'seller', label: 'Seller', options: [...new Set(items.map((p) => p.seller).filter(Boolean))] },
  ], [items]);

  return (
    <div className='rounded-[28px] border border-[#efdcd2] bg-white p-5 shadow-sm'>
      <div className='flex items-center justify-between'>
        <p className='text-base font-bold text-[#34160f]'>Filters</p>
        <button type='button' onClick={onClear} className='text-xs font-semibold text-[#7a1e2c]'>Clear all</button>
      </div>
      <div className='mt-4 space-y-4'>
        {sections.map((s) =>
          s.options.length === 0 ? null : (
            <div key={s.key}>
              <p className='text-sm font-semibold text-[#34160f] mb-2'>{s.label}</p>
              <div className='flex flex-wrap gap-2'>
                {s.options.map((opt) => (
                  <Chip key={opt} active={filters[s.key].includes(opt)} onClick={() => onToggle(s.key, opt)}>
                    {opt}
                  </Chip>
                ))}
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
};

// ── Wishlist page ─────────────────────────────────────────────────────────────
const SORT_OPTIONS = [
  { value: 'recent',    label: 'Recently Added' },
  { value: 'price_asc', label: 'Price: Low → High' },
  { value: 'price_desc', label: 'Price: High → Low' },
];

const Wishlist = ({ wishlistItems, cartItemIds = [], onRemove, onAddToCart, onView, onChatSeller, onShop }) => {
  const [filters, setFilters] = useState({ color: [], fabric: [], design: [], seller: [] });
  const [sort, setSort] = useState('recent');
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const toggleFilter = (key, value) =>
    setFilters((prev) => ({
      ...prev,
      [key]: prev[key].includes(value) ? prev[key].filter((v) => v !== value) : [...prev[key], value],
    }));

  const clearFilters = () => setFilters({ color: [], fabric: [], design: [], seller: [] });

  const filtered = useMemo(() => {
    let result = wishlistItems.filter((p) => {
      if (filters.color.length  && !filters.color.includes(p.color))   return false;
      if (filters.fabric.length && !filters.fabric.includes(p.fabric)) return false;
      if (filters.design.length && !filters.design.includes(p.design)) return false;
      if (filters.seller.length && !filters.seller.includes(p.seller)) return false;
      return true;
    });
    if (sort === 'price_asc')  result = [...result].sort((a, b) => a.price - b.price);
    if (sort === 'price_desc') result = [...result].sort((a, b) => b.price - a.price);
    return result;
  }, [wishlistItems, filters, sort]);

  return (
    <div className='space-y-6'>
      {/* Header */}
      <section className='rounded-[32px] border border-[#efdcd2] bg-white p-6 shadow-[0_18px_45px_rgba(94,35,23,0.08)]'>
        <p className='text-xs font-semibold uppercase tracking-[0.24em] text-[#a6806f]'>My Wishlist</p>
        <div className='mt-2 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between'>
          <div>
            <h1 className='text-3xl font-bold text-[#34160f]'>Saved Sarees</h1>
            <p className='mt-1 text-sm text-[#8b6759]'>
              {wishlistItems.length} {wishlistItems.length === 1 ? 'item' : 'items'} saved
            </p>
          </div>
          <div className='flex items-center gap-3'>
            {/* Sort */}
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className='rounded-full border border-[#ead9cf] bg-white px-4 py-2 text-xs font-semibold text-[#6b5048] outline-none focus:border-[#7a1e2c]'
            >
              {SORT_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
            {/* Mobile filter toggle */}
            <button
              type='button'
              onClick={() => setShowMobileFilters(true)}
              className='inline-flex items-center gap-2 rounded-full border border-[#ead9cf] bg-white px-4 py-2 text-xs font-semibold text-[#7a1e2c] lg:hidden'
            >
              <SlidersHorizontal size={13} /> Filters
            </button>
          </div>
        </div>
      </section>

      {wishlistItems.length === 0 ? (
        <EmptyWishlist onShop={onShop} />
      ) : (
        <div className='grid gap-5 lg:grid-cols-[260px_1fr]'>
          {/* Sidebar filters — desktop */}
          <aside className='hidden lg:block'>
            <div className='sticky top-24'>
              <FilterPanel items={wishlistItems} filters={filters} onToggle={toggleFilter} onClear={clearFilters} />
            </div>
          </aside>

          {/* Grid */}
          <div className='min-w-0'>
            {filtered.length === 0 ? (
              <div className='rounded-2xl border border-dashed border-[#ddc6bb] bg-white px-6 py-14 text-center'>
                <Package size={40} className='mx-auto text-[#d4b5a8] mb-3' />
                <p className='text-base font-bold text-[#34160f]'>No items match your filters</p>
                <button type='button' onClick={clearFilters} className='mt-3 text-sm font-semibold text-[#7a1e2c] hover:underline'>
                  Clear filters
                </button>
              </div>
            ) : (
              <div className='grid gap-4 grid-cols-2 sm:grid-cols-3 xl:grid-cols-4'>
                {filtered.map((item) => (
                  <WishlistCard
                    key={item.id}
                    item={item}
                    inCart={cartItemIds.includes(item.id)}
                    onRemove={onRemove}
                    onAddToCart={onAddToCart}
                    onView={onView}
                    onChatSeller={onChatSeller}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Mobile filter drawer */}
      {showMobileFilters && (
        <div className='fixed inset-0 z-50 flex lg:hidden'>
          <button
            type='button'
            className='absolute inset-0 bg-black/40'
            onClick={() => setShowMobileFilters(false)}
            aria-label='Close filters'
          />
          <div className='relative ml-auto h-full w-full max-w-sm overflow-y-auto bg-[#f7efe8] p-4'>
            <div className='mb-4 flex items-center justify-between'>
              <p className='text-lg font-bold text-[#34160f]'>Filters</p>
              <button
                type='button'
                onClick={() => setShowMobileFilters(false)}
                className='flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#7a1e2c]'
              >
                <X size={16} />
              </button>
            </div>
            <FilterPanel items={wishlistItems} filters={filters} onToggle={toggleFilter} onClear={clearFilters} />
          </div>
        </div>
      )}
    </div>
  );
};

export default Wishlist;
