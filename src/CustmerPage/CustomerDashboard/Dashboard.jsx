import { useEffect, useMemo, useRef, useState } from 'react';
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Heart,
  MessageCircle,
  Package,
  ShoppingCart,
  SlidersHorizontal,
  Sparkles,
  Store,
  X,
  Zap,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { disconnectChatHub, useChatConnection } from '../../hooks/useChatConnection';
import MetaTitle from '../../components/custom/MetaTitle';
import CustomerLayout from '../../components/custom/customer/CustomerLayout';
import Categories from '../Categories/Categories';
import ProductDetail from '../ProductDetail/ProductDetail';
import CustomDesign from '../CustomDesign/CustomDesign';
import Cart from '../Cart/Cart';
import Wishlist from '../Wishlist/Wishlist';
import Checkout from '../Checkout/Checkout';
import Orders from '../Orders/Orders';
import Messages from '../Messages/Messages';
import Profile from '../Profile/Profile';
import { useAuth } from '../../context/auth/AuthContext';
import { showApiSuccess, showApiError } from '../../Utils/Utils';
import ConfirmationModal from '../../components/custom/ConfirmationModal';
import { GetAllProductData } from '../../services/Product/ProductApi';
import { addToWishlist, getWishlist, removeFromWishlist } from '../../ServiceCustmer/Wishlist/WishlistApi';
import { Base_Url } from '../../BaseURL/BaseUrl';

const getUserId = () => {
  try {
    const d = JSON.parse(localStorage.getItem('login') || '{}');
    return d?.userId ?? d?.UserId ?? localStorage.getItem('UserId') ?? '0';
  } catch {
    return '0';
  }
};

const fixUrl = (url) => {
  if (typeof url !== 'string' || !url) return '';
  if (url.startsWith('http')) return url;
  return `${Base_Url}${url.startsWith('/') ? url.slice(1) : url}`;
};

const normalizeProducts = (response) => {
  const raw = Array.isArray(response?.products)
    ? response.products
    : Array.isArray(response?.data)
    ? response.data
    : Array.isArray(response)
    ? response
    : [];

  return raw
    .filter((p) => p?.bIsDeleted !== true && p?.bIsActive !== false)
    .map((p) => ({
      id: p.iProductId,
      iProductId: p.iProductId,
      name: p.sProductTitle ?? p.productName ?? 'Untitled',
      seller: p.sellerName ?? p.sSellerName ?? '',
      sellerUserId: p.sellerUserId ?? p.iSellerUserId ?? null,
      price: Number(p.dcBasePrice ?? 0),
      color: p.sColor ?? '',
      fabric: p.sFabric ?? '',
      design: p.sDesignType ?? '',
      stock: Number(p.productstock ?? p.iStock ?? 0),
      isCustomizationAvailable: p.bIsCustomizationAvailable ?? false,
      description: p.sDescription ?? '',
      images: Array.isArray(p.images)
        ? p.images.map((img) => fixUrl(img.sImageUrl ?? img.src ?? '')).filter(Boolean)
        : [],
    }));
};

const normalizeWishlist = (response) =>
  (Array.isArray(response?.items) ? response.items : [])
    .filter((p) => p?.bIsDeleted !== true && p?.bIsActive !== false)
    .map((p) => ({
      id: p.iProductId,
      wishlistId: p.wishlistId,
      name: p.sProductTitle ?? 'Untitled',
      seller: p.sellerName ?? '',
      sellerUserId: p.sellerUserId ?? null,
      price: Number(p.dcBasePrice ?? 0),
      color: p.sColor ?? '',
      fabric: p.sFabric ?? '',
      design: p.sDesignType ?? '',
      stock: 1,
      isCustomizationAvailable: p.bIsCustomizationAvailable ?? false,
      description: p.sDescription ?? '',
      images: Array.isArray(p.images)
        ? p.images.map((img) => fixUrl(img.sImageUrl ?? '')).filter(Boolean)
        : [],
    }));

// ── Product card ──────────────────────────────────────────────────────────────
const ProductCard = ({ item, onOpen, onAddToCart, onChatSeller, onToggleWishlist, isWished = false }) => {
  const [activeImg, setActiveImg] = useState(0);
  const [added, setAdded] = useState(false);
  const hasImages = item.images.length > 0;
  const total = item.images.length;
  const isOutOfStock = item.stock === 0;

  const handleAddToCart = (e) => {
    e.stopPropagation();
    setAdded(true);
    onAddToCart(item);
    setTimeout(() => setAdded(false), 1500);
  };

  const handleWishlist = (e) => {
    e.stopPropagation();
    onToggleWishlist?.(item);
  };

  const handleChat = (e) => {
    e.stopPropagation();
    onChatSeller({ sellerId: item.sellerUserId, sellerName: item.seller });
  };

  return (
    <div
      className='group flex flex-col bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5 cursor-pointer'
      onClick={() => onOpen(item)}
    >

      {/* Image block */}
      <div className='relative overflow-hidden bg-[#faf7f5]' style={{ aspectRatio: '1/1' }}>
        {hasImages ? (
          <img
            src={item.images[activeImg]}
            alt={item.name}
            className='w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 cursor-pointer'
          />
        ) : (
          <div className='w-full h-full flex flex-col items-center justify-center'>
            <Package size={48} className='text-[#d4b5a8]' />
            <p className='mt-2 text-xs text-[#c4a090]'>No image</p>
          </div>
        )}

        {isOutOfStock && (
          <div className='absolute inset-0 bg-black/40 flex items-center justify-center'>
            <span className='bg-white text-[#7a1e2c] text-xs font-bold px-4 py-1.5 rounded-full shadow'>Out of Stock</span>
          </div>
        )}

        {!isOutOfStock && item.stock <= 5 && (
          <span className='absolute top-2 left-2 bg-orange-500 text-white text-[9px] font-bold px-2 py-0.5 rounded-full shadow'>
            Only {item.stock} left
          </span>
        )}
        {!isOutOfStock && item.stock > 5 && (
          <span className='absolute top-2 left-2 bg-emerald-600 text-white text-[9px] font-bold px-2 py-0.5 rounded-full shadow'>
            In Stock
          </span>
        )}

        <button
          type='button'
          onClick={handleWishlist}
          className={`absolute top-2 right-2 h-7 w-7 flex items-center justify-center rounded-full shadow transition-all duration-200 ${
            isWished ? 'bg-[#7a1e2c] text-white scale-110' : 'bg-white/90 text-[#7a1e2c] hover:bg-white'
          }`}
        >
          <Heart size={12} fill={isWished ? 'currentColor' : 'none'} />
        </button>

        {total > 1 && (
          <>
            <button type='button' onClick={(e) => { e.stopPropagation(); setActiveImg((i) => (i - 1 + total) % total); }}
              className='absolute left-2 top-1/2 -translate-y-1/2 h-7 w-7 flex items-center justify-center rounded-full bg-white/85 text-[#7a1e2c] shadow opacity-0 group-hover:opacity-100 transition-opacity'>
              <ChevronLeft size={14} />
            </button>
            <button type='button' onClick={(e) => { e.stopPropagation(); setActiveImg((i) => (i + 1) % total); }}
              className='absolute right-2 top-1/2 -translate-y-1/2 h-7 w-7 flex items-center justify-center rounded-full bg-white/85 text-[#7a1e2c] shadow opacity-0 group-hover:opacity-100 transition-opacity'>
              <ChevronRight size={14} />
            </button>
          </>
        )}

        {total > 1 && (
          <div className='absolute bottom-0 left-0 right-0 flex gap-1.5 px-2 pb-2 pt-6 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300'>
            {item.images.map((src, i) => (
              <button key={i} type='button' onClick={(e) => { e.stopPropagation(); setActiveImg(i); }}
                className={`h-10 w-10 shrink-0 rounded-lg overflow-hidden border-2 transition-all ${i === activeImg ? 'border-white scale-105' : 'border-white/40 hover:border-white/80'}`}>
                <img src={src} alt='' className='h-full w-full object-cover' />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Info block */}
      <div className='flex flex-col flex-1 p-2.5'>
        <div className='flex items-center gap-1 mb-1'>
          <Store size={10} className='text-[#a6806f] shrink-0' />
          <p className='text-[10px] text-[#a6806f] font-medium truncate'>{item.seller || 'Paithani Artisan'}</p>
        </div>

        <p className='text-xs font-bold text-[#1a0a07] leading-snug line-clamp-2 cursor-pointer hover:text-[#7a1e2c] transition-colors mb-1' onClick={() => onOpen(item)} title={item.name}>
          {item.name}
        </p>

        <p className='text-sm font-extrabold text-[#7a1e2c] mb-1.5'>₹{item.price.toLocaleString('en-IN')}</p>

        <div className='flex flex-wrap gap-1 mb-2'>
          {item.color && (
            <span className='text-[9px] bg-[#fff1e7] text-[#7a1e2c] px-1.5 py-0.5 rounded-full font-medium'>{item.color}</span>
          )}
          {item.fabric && (
            <span className='text-[9px] bg-[#f0f9f4] text-emerald-700 px-1.5 py-0.5 rounded-full font-medium'>{item.fabric}</span>
          )}
          {item.isCustomizationAvailable && (
            <span className='inline-flex items-center gap-0.5 text-[9px] bg-[#fff8e1] text-amber-700 px-1.5 py-0.5 rounded-full font-medium'>
              <Sparkles size={8} /> Custom
            </span>
          )}
        </div>

        {/* Single action row: icon buttons + Add to Cart */}
        <div className='mt-auto flex items-center gap-1'>
          <button
            type='button'
            onClick={() => onOpen(item)}
            title='View'
            className='flex items-center justify-center h-7 w-7 shrink-0 rounded-lg border border-[#e8d5cc] text-[#7a1e2c] hover:bg-[#fff1e7] transition-colors'
          >
            <Zap size={11} />
          </button>
          {item.sellerUserId && (
            <button
              type='button'
              onClick={handleChat}
              title='Chat'
              className='flex items-center justify-center h-7 w-7 shrink-0 rounded-lg border border-[#e8d5cc] text-[#7a1e2c] hover:bg-[#fff1e7] transition-colors'
            >
              <MessageCircle size={11} />
            </button>
          )}
          <button
            type='button'
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            className={`flex-1 min-w-0 flex items-center justify-center gap-1 py-1.5 rounded-lg text-[10px] font-bold transition-all duration-200 ${
              isOutOfStock
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : added
                ? 'bg-emerald-600 text-white'
                : 'bg-[#7a1e2c] text-white hover:bg-[#651623] active:scale-95'
            }`}
          >
            <ShoppingCart size={11} className='shrink-0' />
            <span className='truncate'>{added ? 'Added!' : isOutOfStock ? 'N/A' : 'Add to Cart'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

// ── Horizontal scroll section ─────────────────────────────────────────────────
const ScrollSection = ({ title, subtitle, products, onOpen, onAddToCart, onChatSeller, onToggleWishlist, wishlistIds, onViewAll }) => {
  const ref = useRef(null);
  const scroll = (dir) => ref.current?.scrollBy({ left: dir * 320, behavior: 'smooth' });
  if (!products.length) return null;

  return (
    <section className='rounded-2xl border border-gray-100 bg-white p-5 shadow-sm'>
      <div className='flex items-end justify-between mb-5'>
        <div>
          <p className='text-[11px] font-bold uppercase tracking-widest text-[#a6806f]'>{subtitle}</p>
          <h2 className='mt-1 text-xl font-extrabold text-[#1a0a07]'>{title}</h2>
        </div>
        <div className='flex items-center gap-2'>
          <button type='button' onClick={() => scroll(-1)} className='h-8 w-8 flex items-center justify-center rounded-full border border-gray-200 text-[#7a1e2c] hover:bg-[#fff1e7] transition-colors'>
            <ChevronLeft size={16} />
          </button>
          <button type='button' onClick={() => scroll(1)} className='h-8 w-8 flex items-center justify-center rounded-full border border-gray-200 text-[#7a1e2c] hover:bg-[#fff1e7] transition-colors'>
            <ChevronRight size={16} />
          </button>
          {onViewAll && (
            <button type='button' onClick={onViewAll} className='ml-1 flex items-center gap-1 text-xs font-semibold text-[#7a1e2c] hover:underline'>
              View all <ArrowRight size={12} />
            </button>
          )}
        </div>
      </div>
      <div ref={ref} className='flex gap-4 overflow-x-auto pb-1' style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
        {products.map((item) => (
          <div key={item.id} className='w-[220px] shrink-0'>
            <ProductCard item={item} onOpen={onOpen} onAddToCart={onAddToCart} onChatSeller={onChatSeller} onToggleWishlist={onToggleWishlist} isWished={wishlistIds?.includes(item.id)} />
          </div>
        ))}
      </div>
    </section>
  );
};

// ── All products grid ─────────────────────────────────────────────────────────
const AllProductsGrid = ({ products, onOpen, onAddToCart, onChatSeller, onToggleWishlist, wishlistIds, onViewAll }) => {
  if (!products.length) return (
    <div className='rounded-2xl border border-dashed border-[#ddc6bb] bg-white px-6 py-14 text-center'>
      <Package size={40} className='mx-auto text-[#d4b5a8] mb-3' />
      <p className='text-base font-bold text-[#34160f]'>No products match your filters</p>
      <p className='mt-1 text-sm text-[#8b6759]'>Try adjusting or clearing the filters.</p>
    </div>
  );
  return (
    <section className='rounded-2xl border border-gray-100 bg-white p-5 shadow-sm'>
      <div className='flex items-end justify-between mb-5'>
        <div>
          <p className='text-[11px] font-bold uppercase tracking-widest text-[#a6806f]'>All Products</p>
          <h2 className='mt-1 text-xl font-extrabold text-[#1a0a07]'>
            Complete Collection · <span className='text-[#7a1e2c]'>{products.length} sarees</span>
          </h2>
        </div>
        <button type='button' onClick={onViewAll} className='flex items-center gap-1 text-xs font-semibold text-[#7a1e2c] hover:underline'>
          Browse all <ArrowRight size={12} />
        </button>
      </div>
      <div className='grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4'>
        {products.map((item) => (
          <ProductCard key={item.id} item={item} onOpen={onOpen} onAddToCart={onAddToCart} onChatSeller={onChatSeller} onToggleWishlist={onToggleWishlist} isWished={wishlistIds?.includes(item.id)} />
        ))}
      </div>
    </section>
  );
};

// ── Hero banner ───────────────────────────────────────────────────────────────
const HeroBanner = ({ onShop, onCustom, totalProducts }) => (
  <section className='relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#4a0e1c] via-[#7a1e2c] to-[#3d0f1a] px-6 py-8 text-white shadow-xl sm:px-10 sm:py-12'>
    <div className='absolute -right-16 -top-16 h-64 w-64 rounded-full bg-[#f5d47c]/10 blur-3xl pointer-events-none' />
    <div className='absolute -bottom-10 -left-10 h-48 w-48 rounded-full bg-white/5 blur-3xl pointer-events-none' />
    <div className='relative max-w-2xl'>
      <div className='inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-widest text-[#f5d47c] backdrop-blur-sm mb-4'>
        <Sparkles size={11} /> Handcrafted Paithani Sarees
      </div>
      <h1 className='font-serif text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl'>
        Discover authentic <span className='text-[#f5d47c]'>Paithani sarees</span> from master weavers.
      </h1>
      <p className='mt-4 text-sm leading-7 text-white/70 max-w-lg'>
        Browse {totalProducts}+ handcrafted sarees directly from artisans. Real images, real stock, real prices.
      </p>
      <div className='mt-6 flex flex-wrap gap-3'>
        <button type='button' onClick={onShop} className='inline-flex items-center gap-2 rounded-full bg-[#f5d47c] px-6 py-3 text-sm font-bold text-[#3d0f1a] transition hover:bg-[#f0ca60] active:scale-95'>
          <ShoppingCart size={15} /> Shop Now
        </button>
        <button type='button' onClick={onCustom} className='inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-6 py-3 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-white/15'>
          Custom Design <ArrowRight size={14} />
        </button>
      </div>
    </div>
  </section>
);

// ── Filter helpers ────────────────────────────────────────────────────────────
const FilterChip = ({ active, children, onClick }) => (
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

const buildFilterSections = (products) => [
  { key: 'color',  label: 'Color',  options: [...new Set(products.map((p) => p.color).filter(Boolean))] },
  { key: 'fabric', label: 'Fabric', options: [...new Set(products.map((p) => p.fabric).filter(Boolean))] },
  { key: 'design', label: 'Design', options: [...new Set(products.map((p) => p.design).filter(Boolean))] },
];

const FilterPanel = ({ products, filters, maxPrice, onToggle, onPriceChange, onClear }) => {
  const sections = useMemo(() => buildFilterSections(products), [products]);
  const maxPossible = useMemo(() => Math.max(35000, ...products.map((p) => p.price)), [products]);

  return (
    <div className='rounded-[28px] border border-[#efdcd2] bg-white p-5 shadow-sm'>
      <div className='flex items-center justify-between gap-3'>
        <div>
          <p className='text-xs font-semibold uppercase tracking-[0.24em] text-[#a6806f]'>Filter Sarees</p>
          <p className='mt-1 text-base font-bold text-[#34160f]'>Refine results</p>
        </div>
        <button type='button' onClick={onClear} className='text-xs font-semibold text-[#7a1e2c]'>Clear all</button>
      </div>

      <div className='mt-5'>
        <label className='block text-sm font-semibold text-[#34160f]'>Budget</label>
        <p className='mt-2 text-sm text-[#8b6759]'>
          Up to <span className='font-bold text-[#7a1e2c]'>₹{maxPrice.toLocaleString('en-IN')}</span>
        </p>
        <input
          type='range' min={0} max={maxPossible} step={500}
          value={maxPrice}
          onChange={(e) => onPriceChange(Number(e.target.value))}
          className='mt-3 w-full accent-[#7a1e2c]'
        />
        <div className='mt-1 flex justify-between text-xs text-[#a6806f]'>
          <span>₹0</span><span>₹{maxPossible.toLocaleString('en-IN')}</span>
        </div>
      </div>

      <div className='mt-5 space-y-4'>
        {sections.map((section) =>
          section.options.length === 0 ? null : (
            <div key={section.key}>
              <p className='text-sm font-semibold text-[#34160f]'>{section.label}</p>
              <div className='mt-2 flex flex-wrap gap-2'>
                {section.options.map((opt) => (
                  <FilterChip
                    key={opt}
                    active={filters[section.key].includes(opt)}
                    onClick={() => onToggle(section.key, opt)}
                  >
                    {opt}
                  </FilterChip>
                ))}
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
};

// ── HomeTab ───────────────────────────────────────────────────────────────────
const HomeTab = ({ products, onBrowseCollection, onOpenProduct, onCustomRequest, onAddToCart, onChatSeller, onToggleWishlist, wishlistIds }) => {
  const [filters, setFilters] = useState({ color: [], fabric: [], design: [] });
  const [maxPrice, setMaxPrice] = useState(() => Math.max(35000, ...products.map((p) => p.price)));
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const maxPossible = useMemo(() => Math.max(35000, ...products.map((p) => p.price)), [products]);

  // sync maxPrice ceiling when products load
  useEffect(() => { setMaxPrice(maxPossible); }, [maxPossible]);

  const toggleFilter = (key, value) =>
    setFilters((prev) => ({
      ...prev,
      [key]: prev[key].includes(value) ? prev[key].filter((v) => v !== value) : [...prev[key], value],
    }));

  const clearFilters = () => { setFilters({ color: [], fabric: [], design: [] }); setMaxPrice(maxPossible); };

  const filtered = useMemo(
    () =>
      products.filter((p) => {
        if (filters.color.length  && !filters.color.includes(p.color))   return false;
        if (filters.fabric.length && !filters.fabric.includes(p.fabric)) return false;
        if (filters.design.length && !filters.design.includes(p.design)) return false;
        if (p.price > maxPrice) return false;
        return true;
      }),
    [products, filters, maxPrice],
  );

  const inStock     = filtered.filter((p) => p.stock > 0);
  const outOfStock  = filtered.filter((p) => p.stock === 0);
  const customizable = filtered.filter((p) => p.isCustomizationAvailable);
  const newArrivals  = [...filtered].reverse().slice(0, 10);

  const filterPanelProps = { products, filters, maxPrice, onToggle: toggleFilter, onPriceChange: setMaxPrice, onClear: clearFilters };

  return (
    <div className='space-y-5'>
      {/* Two-column layout wraps everything below the hero */}
      <div className='grid gap-5 lg:grid-cols-[260px_1fr]'>

        {/* ── Left: filter sidebar (desktop) ── */}
        <aside className='hidden lg:block'>
          <div className='sticky top-24 space-y-4'>
            <FilterPanel {...filterPanelProps} />
          </div>
        </aside>

        {/* ── Right: all content ── */}
        <div className='min-w-0 space-y-5'>
          <HeroBanner onShop={onBrowseCollection} onCustom={onCustomRequest} totalProducts={products.length} />

          {products.length > 0 && (
            <div className='grid grid-cols-2 gap-3 sm:grid-cols-4'>
              {[
                { label: 'Total Products', value: products.length, color: 'bg-[#fff1e7] text-[#7a1e2c]' },
                { label: 'In Stock',       value: inStock.length,  color: 'bg-[#f0fdf4] text-emerald-700' },
                { label: 'Out of Stock',   value: outOfStock.length, color: 'bg-[#fef2f2] text-red-600' },
                { label: 'Customizable',   value: customizable.length, color: 'bg-[#fffbeb] text-amber-700' },
              ].map((s) => (
                <div key={s.label} className={`rounded-xl p-4 ${s.color} border border-current/10`}>
                  <p className='text-2xl font-extrabold'>{s.value}</p>
                  <p className='text-xs font-semibold mt-0.5 opacity-80'>{s.label}</p>
                </div>
              ))}
            </div>
          )}

          {/* Mobile filter toggle */}
          <div className='flex items-center justify-between lg:hidden'>
            <p className='text-sm font-semibold text-[#34160f]'>{filtered.length} products</p>
            <button
              type='button'
              onClick={() => setShowMobileFilters(true)}
              className='inline-flex items-center gap-2 rounded-full border border-[#ead9cf] bg-white px-4 py-2.5 text-sm font-semibold text-[#7a1e2c]'
            >
              <SlidersHorizontal size={15} /> Filters
            </button>
          </div>

          <ScrollSection
            title='New Arrivals' subtitle='Just added'
            products={newArrivals} onOpen={onOpenProduct}
            onAddToCart={onAddToCart} onChatSeller={onChatSeller}
            onToggleWishlist={onToggleWishlist} wishlistIds={wishlistIds}
            onViewAll={onBrowseCollection}
          />

          {customizable.length > 0 && (
            <ScrollSection
              title='Make It Yours' subtitle='Customizable sarees'
              products={customizable} onOpen={onOpenProduct}
              onAddToCart={onAddToCart} onChatSeller={onChatSeller}
              onToggleWishlist={onToggleWishlist} wishlistIds={wishlistIds}
            />
          )}

          <AllProductsGrid
            products={filtered} onOpen={onOpenProduct}
            onAddToCart={onAddToCart} onChatSeller={onChatSeller}
            onToggleWishlist={onToggleWishlist} wishlistIds={wishlistIds}
            onViewAll={onBrowseCollection}
          />
        </div>
      </div>

      {/* Mobile filter drawer */}
      {showMobileFilters && (
        <div className='fixed inset-0 z-50 flex lg:hidden'>
          <button type='button' className='absolute inset-0 bg-black/40' onClick={() => setShowMobileFilters(false)} aria-label='Close filters' />
          <div className='relative ml-auto h-full w-full max-w-sm overflow-y-auto bg-[#f7efe8] p-4'>
            <div className='mb-4 flex items-center justify-between'>
              <p className='text-lg font-bold text-[#34160f]'>Filters</p>
              <button type='button' onClick={() => setShowMobileFilters(false)} className='flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#7a1e2c]'>
                <X size={16} />
              </button>
            </div>
            <FilterPanel {...filterPanelProps} />
          </div>
        </div>
      )}
    </div>
  );
};

// ── Main CustomerDashboard ────────────────────────────────────────────────────
const CustomerDashboard = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const connection = useChatConnection();
  const [activeTab, setActiveTab] = useState('home');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [chatTarget, setChatTarget] = useState(null); // { sellerId, sellerName }
  const [cartCount, setCartCount] = useState(() => {
    try {
      const d = JSON.parse(localStorage.getItem('login') || '{}');
      return Number(d?.cartItemCount ?? 0);
    } catch { return 0; }
  });
  const [unreadCount, setUnreadCount] = useState(0);
  const [products, setProducts] = useState([]);
  const [wishlistItems, setWishlistItems] = useState([]);
  const [cartItemIds, setCartItemIds] = useState([]);
  const [wishlistLoaded, setWishlistLoaded] = useState(false);
  const [wishlistConfirm, setWishlistConfirm] = useState(null); // { type: 'add'|'remove', item }

  const productsFetched = useRef(false);

  useEffect(() => {
    if (productsFetched.current) return;
    productsFetched.current = true;
    GetAllProductData(getUserId())
      .then((res) => setProducts(normalizeProducts(res)))
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!connection) return;
    const handler = () => setUnreadCount((prev) => prev + 1);
    connection.on('NewMessageNotification', handler);
    return () => connection.off('NewMessageNotification', handler);
  }, [connection]);

  useEffect(() => {
    if (activeTab === 'messages') setUnreadCount(0);
  }, [activeTab]);

  const handleLogout = () => {
    disconnectChatHub();
    logout();
    ['login', 'token', 'UserId', 'RoleId'].forEach((k) => localStorage.removeItem(k));
    showApiSuccess('Logged out successfully');
    window.setTimeout(() => navigate('/'), 300);
  };

  const [previousTab, setPreviousTab] = useState('home');

  useEffect(() => { window.scrollTo({ top: 0, behavior: 'smooth' }); }, [activeTab]);

  const handleViewDetail = (product) => { setPreviousTab(activeTab); setSelectedProduct(product); setActiveTab('product-detail'); };
  const handleAddToCart = (product) => {
    setCartCount((c) => c + 1);
    if (product?.id) setCartItemIds((prev) => [...new Set([...prev, product.id])]);
    setActiveTab('cart');
  };

  const handleToggleWishlist = (item) => {
    const alreadyWished = wishlistItems.find((p) => p.id === item.id);
    setWishlistConfirm({ type: alreadyWished ? 'remove' : 'add', item });
  };

  const confirmWishlistAction = async () => {
    if (!wishlistConfirm) return;
    const { type, item } = wishlistConfirm;
    setWishlistConfirm(null);

    if (type === 'add') {
      setWishlistItems((prev) => [...prev, item]);
      try {
        await addToWishlist({ userId: Number(getUserId()), productId: item.id });
        showApiSuccess('Added to wishlist successfully.');
      } catch {
        setWishlistItems((prev) => prev.filter((p) => p.id !== item.id));
        showApiError('Failed to add to wishlist.');
      }
    } else {
      setWishlistItems((prev) => prev.filter((p) => p.id !== item.id));
      try {
        await removeFromWishlist(item.wishlistId);
        showApiSuccess('Removed from wishlist.');
      } catch {
        setWishlistItems((prev) => [...prev, item]);
        showApiError('Failed to remove from wishlist.');
      }
    }
  };

  const handleRemoveFromWishlist = (productId) => {
    const item = wishlistItems.find((p) => p.id === productId);
    if (item) setWishlistConfirm({ type: 'remove', item });
  };

  useEffect(() => {
    if (activeTab !== 'wishlist' || wishlistLoaded) return;
    getWishlist(Number(getUserId()))
      .then((res) => { setWishlistItems(normalizeWishlist(res)); setWishlistLoaded(true); })
      .catch(() => {});
  }, [activeTab, wishlistLoaded]);

  // Called from product card Chat button — passes sellerUserId + sellerName
  const handleChatSeller = ({ sellerId, sellerName }) => {
    setChatTarget({ sellerId, sellerName });
    setActiveTab('messages');
    setUnreadCount(0);
  };

  const customerTitle = useMemo(() => {
    if (activeTab === 'product-detail') return 'Product Details | Majhi Paithani';
    return ({
      wishlist: 'My Wishlist | Majhi Paithani',
      home: 'Customer Home | Majhi Paithani',
      categories: 'Shop Sarees | Majhi Paithani',
      custom: 'Custom Design | Majhi Paithani',
      cart: 'Your Cart | Majhi Paithani',
      checkout: 'Checkout | Majhi Paithani',
      orders: 'My Orders | Majhi Paithani',
      messages: 'Messages | Majhi Paithani',
      profile: 'My Profile | Majhi Paithani',
    })[activeTab] || 'Majhi Paithani';
  }, [activeTab]);

  const renderContent = () => {
    if (activeTab === 'product-detail') {
      return (
        <ProductDetail
          product={selectedProduct}
          onBack={() => { setActiveTab(previousTab); setSelectedProduct(null); }}
          onAddToCart={handleAddToCart}
          onBuyNow={() => setActiveTab('checkout')}
          onCustomRequest={() => setActiveTab('custom')}
          onChatSeller={handleChatSeller}
        />
      );
    }
    switch (activeTab) {
      case 'home':
        return (
          <HomeTab
            products={products}
            onBrowseCollection={() => setActiveTab('categories')}
            onOpenProduct={handleViewDetail}
            onCustomRequest={() => setActiveTab('custom')}
            onAddToCart={handleAddToCart}
            onChatSeller={handleChatSeller}
            onToggleWishlist={handleToggleWishlist}
            wishlistIds={wishlistItems.map((p) => p.id)}
          />
        );
      case 'categories':
        return <Categories onViewDetail={handleViewDetail} searchTerm={searchTerm} />;
      case 'custom':
        return <CustomDesign />;
      case 'wishlist':
        return (
          <Wishlist
            wishlistItems={wishlistItems}
            cartItemIds={cartItemIds}
            onRemove={handleRemoveFromWishlist}
            onAddToCart={handleAddToCart}
            onView={handleViewDetail}
            onChatSeller={handleChatSeller}
            onShop={() => setActiveTab('categories')}
          />
        );
      case 'cart':
        return <Cart onCheckout={() => setActiveTab('checkout')} onChatSeller={handleChatSeller} onCartCountChange={setCartCount} />;
      case 'checkout':
        return <Checkout onBack={() => setActiveTab('cart')} onSuccess={() => setActiveTab('orders')} />;
      case 'orders':
        return <Orders />;
      case 'messages':
        return (
          <Messages
            initialReceiverId={chatTarget?.sellerId}
            initialReceiverName={chatTarget?.sellerName}
          />
        );
      case 'profile':
        return <Profile onLogout={handleLogout} />;
      default:
        return (
          <HomeTab
            products={products}
            onBrowseCollection={() => setActiveTab('categories')}
            onOpenProduct={handleViewDetail}
            onCustomRequest={() => setActiveTab('custom')}
            onAddToCart={handleAddToCart}
            onChatSeller={handleChatSeller}
            onToggleWishlist={handleToggleWishlist}
            wishlistIds={wishlistItems.map((p) => p.id)}
          />
        );
    }
  };

  return (
    <>
      <MetaTitle title={customerTitle} />
      <ConfirmationModal
        open={!!wishlistConfirm}
        title={wishlistConfirm?.type === 'add' ? 'Add to Wishlist?' : 'Remove from Wishlist?'}
        message={
          wishlistConfirm?.type === 'add'
            ? `Add "${wishlistConfirm?.item?.name}" to your wishlist?`
            : `Remove "${wishlistConfirm?.item?.name}" from your wishlist?`
        }
        confirmLabel={wishlistConfirm?.type === 'add' ? 'Yes, Add' : 'Yes, Remove'}
        cancelLabel='Cancel'
        onConfirm={confirmWishlistAction}
        onClose={() => setWishlistConfirm(null)}
      />
      <CustomerLayout
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        cartCount={cartCount}
        unreadCount={unreadCount}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
      >
        {renderContent()}
      </CustomerLayout>
    </>
  );
};

export default CustomerDashboard;
